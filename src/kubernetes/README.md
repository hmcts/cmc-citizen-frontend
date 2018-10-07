# AKS : Azure Managed Kubernetes

## Setup - run once

- Install cli: `az acs kubernetes install-cli`
- Login: `az login`
- Set azure subscription:  `az account set --subscription DCD-CNP-DEV`
- Add to k8s cli (kubectl): `az aks get-credentials -n cnp-aks-cluster -g cnp-aks-rg`

## Post-Setup

- Set context: `kubectl config use-context cnp-aks-cluster`
- Test by showing k8s nodes: `kubectl get nodes`
- Show deployments, pods, services, ingress for CMC: `kubectl get deploy,po,svc,ing -n cmc`

## Tips

https://tools.hmcts.net/confluence/display/CNP/Using+Containers+in+the+Pipeline#UsingContainersinthePipeline-ManualDeleteScript

https://kubernetes.io/docs/reference/kubectl/cheatsheet/

```
kubectl config view                         # Show Merged kubeconfig settings.
kubectl config current-context              # Display the current-context
```

## To Configure Frontend to use Claim-Store Backend in Kubernetes

Note: untested until some changes are made to claim-store

```
kubectl get ns | grep cmc-claim-store
kubectl get ingress -n cmc-claim-store-pr-XXX  # value from above
kubectl edit cm -n cmc-citizen-frontend-pr-XXX cmc-citizen-frontend-pr-XXX-config  # value from your frontend PR

# this will open an editor - edit the CLAIM_STORE_URL to use domain given in ingress command above.
# save and close - you should get no errors

kubectl get po -n cmc-citizen-frontend-pr-XXX  
kubectl delete po cmc-citizen-frontend-pr-XXX-????????-?????

# wait to restart and new config should have taken effect

```

## Known Issues

- Emails will include wrong domain - unless claim-store used has correct FRONTEND_BASE_URL for your PR.
