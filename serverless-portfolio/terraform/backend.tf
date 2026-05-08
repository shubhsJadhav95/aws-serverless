terraform {
  backend "s3" {
    bucket         = "shubhsjadhav95-terraform" # change this
    key            = "shubhs/terraform.tfstate"
    region         = "us-east-1"
  }
}