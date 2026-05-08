

# ACM certificate for CloudFront must be in us-east-1
provider "aws" {
  alias  = "us_east_1"
  region = "us-east-1"
}


resource "aws_s3_bucket" "my_bucket" {
  bucket = "shubhsjadhav95-serverless-web"
}


resource "aws_s3_object" "index_html" {
  bucket       = aws_s3_bucket.my_bucket.id
  key          = "index.html"
  source       = "../index.html"
  content_type = "text/html"

  etag = filemd5("../index.html")
}


resource "aws_cloudfront_origin_access_control" "oac" {
  name                              = "S3-OAC-2"
  description                       = "OAC for S3"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}




resource "aws_cloudfront_distribution" "my_distribution" {
  enabled             = true
  default_root_object = "index.html"

  aliases = [
    "portfolio.devcloudzone.store"
  ]

  origin {
    domain_name              = aws_s3_bucket.my_bucket.bucket_regional_domain_name
    origin_id                = "S3Origin"
    origin_access_control_id = aws_cloudfront_origin_access_control.oac.id

    s3_origin_config {
      origin_access_identity = ""
    }
  }

  default_cache_behavior {
    target_origin_id       = "S3Origin"
    viewer_protocol_policy = "redirect-to-https"

    allowed_methods = [
      "GET",
      "HEAD"
    ]

    cached_methods = [
      "GET",
      "HEAD"
    ]

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    acm_certificate_arn = "arn:aws:acm:us-east-1:347026173735:certificate/6c33d96f-ba4a-4cdb-ac0b-d431a1a52439"
    ssl_support_method  = "sni-only"

    minimum_protocol_version = "TLSv1.2_2021"
  }
}


resource "aws_s3_bucket_policy" "bucket_policy" {
  bucket = aws_s3_bucket.my_bucket.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "AllowCloudFrontAccessOnly"
        Effect = "Allow"

        Principal = {
          Service = "cloudfront.amazonaws.com"
        }

        Action = "s3:GetObject"

        Resource = "${aws_s3_bucket.my_bucket.arn}/*"

        Condition = {
          StringEquals = {
            "AWS:SourceArn" = aws_cloudfront_distribution.my_distribution.arn
          }
        }
      }
    ]
  })
}



resource "aws_route53_record" "dns_record" {
  zone_id = "Z011571237RK24JJ52PL5"
  name    = "portfolio.devcloudzone.store"
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.my_distribution.domain_name
    zone_id                = aws_cloudfront_distribution.my_distribution.hosted_zone_id
    evaluate_target_health = false
  }
}



output "cloudfront_url" {
  value = aws_cloudfront_distribution.my_distribution.domain_name
}

output "website_url" {
  value = "https://portfolio.devcloudzone.store"
}