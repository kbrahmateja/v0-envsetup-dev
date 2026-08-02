import fs from 'fs-extra'
import path from 'path'

/**
 * Generates infrastructure config files based on selected tools.
 * Extracted from new.ts sections 11–15 so they can be unit-tested independently.
 */
export async function generateInfraFiles(
  projectDir: string,
  name: string,
  language: string,
  selectedTools: string[]
): Promise<string[]> {
  const generated: string[] = []

  // 11. Kubernetes manifests
  if (selectedTools.includes('kubernetes')) {
    const k8sDir = path.join(projectDir, 'k8s')
    await fs.ensureDir(k8sDir)
    const appPort = language === 'python' ? 8000 : language === 'go' || language === 'rust' ? 8080 : 3000
    await fs.writeFile(path.join(k8sDir, 'deployment.yaml'), `apiVersion: apps/v1
kind: Deployment
metadata:
  name: ${name}
  labels:
    app: ${name}
spec:
  replicas: 2
  selector:
    matchLabels:
      app: ${name}
  template:
    metadata:
      labels:
        app: ${name}
    spec:
      containers:
        - name: ${name}
          image: ${name}:latest
          ports:
            - containerPort: ${appPort}
          envFrom:
            - secretRef:
                name: ${name}-secrets
          resources:
            requests:
              cpu: "100m"
              memory: "128Mi"
            limits:
              cpu: "500m"
              memory: "512Mi"
          readinessProbe:
            httpGet:
              path: /health
              port: ${appPort}
            initialDelaySeconds: 10
            periodSeconds: 5
          livenessProbe:
            httpGet:
              path: /health
              port: ${appPort}
            initialDelaySeconds: 30
            periodSeconds: 10
`)
    await fs.writeFile(path.join(k8sDir, 'service.yaml'), `apiVersion: v1
kind: Service
metadata:
  name: ${name}-svc
spec:
  selector:
    app: ${name}
  ports:
    - protocol: TCP
      port: 80
      targetPort: ${appPort}
  type: ClusterIP
`)
    await fs.writeFile(path.join(k8sDir, 'ingress.yaml'), `apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: ${name}-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
    cert-manager.io/cluster-issuer: letsencrypt-prod
spec:
  ingressClassName: nginx
  tls:
    - hosts:
        - yourdomain.com
      secretName: ${name}-tls
  rules:
    - host: yourdomain.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: ${name}-svc
                port:
                  number: 80
`)
    await fs.writeFile(path.join(k8sDir, 'hpa.yaml'), `apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: ${name}-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: ${name}
  minReplicas: 2
  maxReplicas: 10
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70
    - type: Resource
      resource:
        name: memory
        target:
          type: Utilization
          averageUtilization: 80
`)
    await fs.writeFile(path.join(k8sDir, 'secret.yaml'), `apiVersion: v1
kind: Secret
metadata:
  name: ${name}-secrets
type: Opaque
stringData:
  DATABASE_URL: "postgresql://user:pass@postgres:5432/${name}"
  SECRET_KEY: "change-me-in-production"
  # Add other secrets here
`)
    generated.push('k8s/deployment.yaml', 'k8s/service.yaml', 'k8s/ingress.yaml', 'k8s/hpa.yaml', 'k8s/secret.yaml')
  }

  // 12. Nginx reverse proxy config
  if (selectedTools.includes('nginx')) {
    const appPort = language === 'python' ? 8000 : language === 'go' || language === 'rust' ? 8080 : 3000
    await fs.ensureDir(path.join(projectDir, 'nginx'))
    await fs.writeFile(path.join(projectDir, 'nginx', 'nginx.conf'), `events {
  worker_connections 1024;
}

http {
  upstream app {
    least_conn;
    server app:${appPort};
    # Add more instances for load balancing:
    # server app2:${appPort};
    # server app3:${appPort};
  }

  # Rate limiting
  limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
  limit_conn_zone $binary_remote_addr zone=conn:10m;

  server {
    listen 80;
    server_name _;

    # Redirect HTTP → HTTPS
    return 301 https://$host$request_uri;
  }

  server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate     /etc/nginx/certs/cert.pem;
    ssl_certificate_key /etc/nginx/certs/key.pem;
    ssl_protocols       TLSv1.2 TLSv1.3;

    # Rate limit API
    location /api/ {
      limit_req zone=api burst=20 nodelay;
      limit_conn conn 10;
      proxy_pass http://app;
      proxy_set_header Host $host;
      proxy_set_header X-Real-IP $remote_addr;
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header X-Forwarded-Proto $scheme;
    }

    location / {
      proxy_pass http://app;
      proxy_set_header Host $host;
      proxy_set_header X-Real-IP $remote_addr;
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
  }
}
`)
    generated.push('nginx/nginx.conf')
  }

  // 13. Traefik config
  if (selectedTools.includes('traefik')) {
    await fs.ensureDir(path.join(projectDir, 'traefik'))
    await fs.writeFile(path.join(projectDir, 'traefik', 'traefik.yml'), `api:
  dashboard: true
  insecure: false

entryPoints:
  web:
    address: ":80"
    http:
      redirections:
        entryPoint:
          to: websecure
          scheme: https
  websecure:
    address: ":443"

certificatesResolvers:
  letsencrypt:
    acme:
      email: your@email.com
      storage: /letsencrypt/acme.json
      httpChallenge:
        entryPoint: web

providers:
  docker:
    exposedByDefault: false
  file:
    directory: /traefik/dynamic

log:
  level: INFO
`)
    await fs.writeFile(path.join(projectDir, 'traefik', 'dynamic.yml'), `http:
  middlewares:
    rateLimit:
      rateLimit:
        average: 100
        burst: 50
    secureHeaders:
      headers:
        sslRedirect: true
        stsSeconds: 31536000
        contentTypeNosniff: true
        browserXssFilter: true
`)
    generated.push('traefik/traefik.yml', 'traefik/dynamic.yml')
  }

  // 14. Kafka docker-compose snippet
  if (selectedTools.includes('kafka')) {
    await fs.writeFile(path.join(projectDir, 'kafka-compose.yml'), `# Add these services to your docker-compose.yml
services:
  zookeeper:
    image: confluentinc/cp-zookeeper:7.5.0
    environment:
      ZOOKEEPER_CLIENT_PORT: 2181
    ports:
      - "2181:2181"

  kafka:
    image: confluentinc/cp-kafka:7.5.0
    depends_on:
      - zookeeper
    ports:
      - "9092:9092"
    environment:
      KAFKA_BROKER_ID: 1
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://localhost:9092
      KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 1
      KAFKA_AUTO_CREATE_TOPICS_ENABLE: "true"

  kafka-ui:
    image: provectuslabs/kafka-ui:latest
    depends_on:
      - kafka
    ports:
      - "8090:8080"
    environment:
      KAFKA_CLUSTERS_0_NAME: local
      KAFKA_CLUSTERS_0_BOOTSTRAPSERVERS: kafka:9092
`)
    generated.push('kafka-compose.yml')
  }

  // 15. RabbitMQ docker-compose snippet
  if (selectedTools.includes('rabbitmq')) {
    await fs.writeFile(path.join(projectDir, 'rabbitmq-compose.yml'), `# Add these services to your docker-compose.yml
services:
  rabbitmq:
    image: rabbitmq:3.13-management
    ports:
      - "5672:5672"    # AMQP
      - "15672:15672"  # Management UI
    environment:
      RABBITMQ_DEFAULT_USER: admin
      RABBITMQ_DEFAULT_PASS: password
    volumes:
      - rabbitmq_data:/var/lib/rabbitmq
    healthcheck:
      test: rabbitmq-diagnostics -q ping
      interval: 30s
      timeout: 10s
      retries: 5

volumes:
  rabbitmq_data:
`)
    generated.push('rabbitmq-compose.yml')
  }

  return generated
}
