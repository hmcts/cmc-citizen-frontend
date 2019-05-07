output "idam_url" {
  value = "${var.idam_api_url}"
}

output "claim_store_url" {
  value = "${local.claimStoreUrl}"
}

output "feature_admissions" {
  value = "${var.feature_admissions}"
}

output "feature_paid_in_full" {
  value = "${var.feature_paid_in_full}"
}

output "feature_new_features_consent" {
  value = "${var.feature_new_features_consent}"
}

output "feature_fine_print" {
  value = "${var.feature_fine_print}"
}

output "feature_return_error_to_user" {
  value = "${var.feature_return_error_to_user}"
}

output "feature_mock_pay" {
  value = "${var.feature_mock_pay}"
}

output "feature_testing_support" {
  value = "${var.feature_testing_support}"
}
