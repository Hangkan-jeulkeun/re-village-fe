# Frontend Kubernetes

`k8s/frontend`는 프론트엔드(Next.js) 배포를 위한 기본 Kubernetes 매니페스트 모음입니다.

## 파일 구성

- `frontend.yaml`: Deployment + Service
- `ingress.yaml`: Ingress
- `kustomization.yaml`: Kustomize 엔트리 포인트
- `config/frontend-config.json`: 런타임 설정용 ConfigMap 원본

## 배포 전 변경

1. `k8s/frontend/kustomization.yaml`의 이미지 주소를 실제 레지스트리로 수정
2. `k8s/frontend/ingress.yaml`의 도메인(host) 수정
3. `k8s/frontend/config/frontend-config.json` 값 수정

## 배포

```bash
kubectl apply -k k8s/frontend
```

## 확인

```bash
kubectl get deploy,svc,ing -n goormthon-6
kubectl describe ingress frontend -n goormthon-6
```
