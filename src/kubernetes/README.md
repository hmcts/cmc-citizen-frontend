# AKS : Azure Managed Kubernetes

## CNP Confluence Page

Should definitely read through this page first: https://tools.hmcts.net/confluence/display/CNP/Using+Containers+in+the+Pipeline

## Setup - run once

- Install Azure cli: `brew install azure-cli`
- Install Kubernetes (k8s) cli: `az acs kubernetes install-cli`
- Login: `az login`
- Set azure subscription:  `az account set --subscription DCD-CNP-DEV`
- Add to k8s cli (kubectl): `az aks get-credentials -n cnp-aks-cluster -g cnp-aks-rg`

## Post-Setup

- Set context: `kubectl config use-context cnp-aks-cluster`
- Test by showing k8s nodes: `kubectl get nodes`. You should see something similar to: 
``` 
$ kubectl get nodes
NAME                       STATUS    ROLES     AGE       VERSION
aks-nodepool1-11596463-0   Ready     agent     9d        v1.11.2
aks-nodepool1-11596463-1   Ready     agent     9d        v1.11.2
aks-nodepool1-11596463-2   Ready     agent     9d        v1.11.2
aks-nodepool1-11596463-3   Ready     agent     9d        v1.11.2
aks-nodepool1-11596463-4   Ready     agent     9d        v1.11.2
```
- You're good to go!

## Using the Kubernetes Dashboard

You will probably find `kubectl` the easiest way to interact with Kubernetes but there
is a dashboard available too:

https://tools.hmcts.net/confluence/display/CNP/Using+Containers+in+the+Pipeline#UsingContainersinthePipeline-UsingtheKubernetesDashboard

This does give you some resource metrics you won't get using `kubectl` i.e. memory, cpu

## Tips

Install kubectx: https://github.com/ahmetb/kubectx ::: this helps switching namespace and contexts

https://kubernetes.io/docs/reference/kubectl/cheatsheet/

```
kubectl config view                         # Show Merged kubeconfig settings.
kubectl config current-context              # Display the current-context
```
