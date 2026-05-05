# 🚀 Serverless Portfolio

🌐 **Live Website:**
https://portfolio.devcloudzone.store/

---

## 📌 Overview

This project demonstrates a **serverless static website deployment** using AWS services, fully automated via **AWS CloudFormation**.

It showcases how to build a **secure, scalable, and cost-effective** hosting solution without managing servers.

---

## 🧰 Tech Stack

* AWS CloudFormation (Infrastructure as Code)
* Amazon S3 (Static website storage)
* Amazon CloudFront (CDN with OAC)
* AWS Certificate Manager (SSL/TLS)
* Amazon Route 53 (DNS management)

---

## 🌐 Domain & DNS Setup

* Hosted Zone: `devcloudzone.store` (pre-configured in Route 53)
* Domain purchased via GoDaddy
* Nameservers updated in GoDaddy to point to Route 53
* SSL certificate validated using ACM

---

## ⚙️ Infrastructure Deployment (CloudFormation)

All resources are provisioned using a single CloudFormation template:

### ✔️ S3 Bucket

* Created for static website hosting
* Configured as **private**
* Attached secure bucket policy for CloudFront access

### ✔️ CloudFront Distribution

* Connected to S3 as origin
* Uses **Origin Access Control (OAC)** for secure access
* Default root object: `index.html`
* HTTPS enabled with ACM certificate
* Global content delivery via CDN

### ✔️ Route 53 Configuration

* Created **A record (Alias)**
* Subdomain mapped to CloudFront distribution:

  ```
  portfolio.devcloudzone.store
  ```

---

## 🔄 Workflow

### 1. Create S3 Bucket

* Stores static files (HTML, CSS, JS)
* Public access blocked

---

### 2. Configure Origin Access Control (OAC)

* Restricts S3 access to CloudFront only
* Enhances security

---

### 3. Create CloudFront Distribution

* Links to S3 bucket
* Enables HTTPS
* Sets `index.html` as default entry point

---

### 4. Attach SSL Certificate (ACM)

* Certificate created in `us-east-1`
* Validated for custom domain

---

### 5. Apply S3 Bucket Policy

```json
{
  "Effect": "Allow",
  "Principal": {
    "Service": "cloudfront.amazonaws.com"
  },
  "Action": "s3:GetObject",
  "Resource": "arn:aws:s3:::YOUR-BUCKET-NAME/*",
  "Condition": {
    "StringEquals": {
      "AWS:SourceArn": "arn:aws:cloudfront::ACCOUNT-ID:distribution/DISTRIBUTION-ID"
    }
  }
}
```

---

### 6. Configure Route 53

* Alias record points domain → CloudFront
* Enables custom domain access

---

### 7. Upload Website Files

* `index.html`
* `style.css`
* `script.js`

---

## 🔐 Security

* S3 bucket is **private**
* Access allowed only via CloudFront (OAC)
* HTTPS enforced using SSL certificate

---

## 💰 Cost Overview (Free Tier)

| Service    | Cost         |
| ---------- | ------------ |
| S3         | Free (≤5GB)  |
| CloudFront | Free (≤1TB)  |
| ACM        | Free         |
| Route 53   | ~$0.50/month |

---

## ⚠️ Common Issues

* **403 Forbidden** → Check bucket policy and OAC
* **SSL errors** → Ensure ACM is in `us-east-1`
* **Domain not resolving** → Verify Route 53 records
* **Blank page** → Ensure `index.html` is uploaded

---

## ✅ Final Output

* 🌐 https://portfolio.devcloudzone.store
* ⚡ Fast, secure, globally distributed website

---

## 🧠 Key Concept

> **Serverless Architecture**: No server management required. AWS handles scaling, availability, and infrastructure automatically.

---
