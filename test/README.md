# Serverless Web Application on AWS

## Project Name: Serverless Web Application on AWS
https://www.youtube.com/watch?v=FIcwB8AVQF4&list=PLjl2dJMjkDjnIN1pYkTf-lGQprF6rN-Ot&index=15

### Project Description:

In this project, you will build a serverless web application using AWS Lambda, DynamoDB, and S3. The application will allow users to create, read, update, and delete (CRUD) items from a DynamoDB table.

### Project Architecture:

![Serverless Web Application on AWS Architecture](https://user-images.githubusercontent.com/66474973/228492073-5cd3d975-3439-4ce4-b109-fb33997df3c3.png)

### Steps to Build the Project:

Create an S3 Bucket xyz

Upload static webpage files html,css,json

Cloudfront set origin as S3 Bucket xyz 

Copy the policy from a cloudfront to connecct to S3 bucket xyz

Paste in S3 Bucket Policy 

Cloudfront set default root object as index.html for origin Endpoint 

route 53 add record inn which enter domain endpoint prefix and create a certificate

same certificate add in ann cloudfront to prefix enndpoint

create an dynamodb table and lambda function 

write an code for generate view count in webpage and reupload my webpage file with updated function url





# aws-serverless
