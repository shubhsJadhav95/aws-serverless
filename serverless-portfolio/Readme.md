# Serverless Portfolio

https://portfolio.devcloudzone.store/

## Using Aws clouformation

## AWS s3 , AWS cloudfront ,Aws Route 53 

### Route 53 consist of already hosted zone devcloudzone.store
### added nameserver to my domain DNS in godaddy
### ACM valiation of certificate

### following steps are performed by a cloudfromation

### Created an s3 bucket and added an cloudfront Access bucket policy attached
### Upload your index.html file

### Cloudfront creates an distribution which consists following 
### --> defalut root index.html
### --> origin as origin access control
### --> validated a certificate of my domain
### --> Get bucket policy via Origin/edit

### In Route 53 added an record of alias subdomain of a cloudfront
### portfolio.devcloudzone.store from cludfront 



## 🔄 Workflow

### 1. Create S3 Bucket
- Stores static website files (HTML, CSS, JS)
- Bucket is **private** (no public access)

---

### 2. Configure Origin Access Control (OAC)
- Ensures only CloudFront can access S3
- Prevents direct public access to bucket

---

### 3. Create CloudFront Distribution
- Connects to S3 as origin
- Enables HTTPS
- Uses `index.html` as default root object

---

### 4. Attach SSL Certificate (ACM)
- Certificate must be in `us-east-1`
- Used for custom domain HTTPS

---

### 5. Apply S3 Bucket Policy
Allows only CloudFront to access S3:

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


                                                                

