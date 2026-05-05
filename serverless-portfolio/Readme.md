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

### Cloudfront creates an distribution which consists following --> defalut root index.html
###                                                             --> origin as origin access control
###                                                             --> validated a certificate of my domain
###                                                             --> Get bucket policy via Origin/edit

### In Route 53 added an record of alias subdomain of a cloudfront 

                                                                

