# Tidy Moose

This project provides various utilities related to investing.

## Redirect Investing Symbol

This implements a Google Cloud Function which redirects an HTTP request to the Investing.com page
given an exchange symbol. For example, going to https://us-central1-brians-playground.cloudfunctions.net/redirectInvestingSymbol?symbol=goog will redirect you to https://www.investing.com/equities/google-inc-c. The `symbol` query parameter is required, and can be set to any exchange symbol.

To deploy this function:

    gcloud beta functions deploy redirectInvestingSymbol --stage-bucket blachniet_gcf --trigger-http
    
