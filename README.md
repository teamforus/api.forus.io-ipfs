# api.forus.io-ipfs

## Document store
The document store provides storage for arbitrary JSON documents.
The id in the URL corresponds to the id field in the document. When there is a conflict between these, the value in the URL takes precedence.

### /api/v1/docs/{document_type}/{id}

#### Get document [GET]

+ Response 200 (application/json)
    + Body
        {
            "id": {id}
            "name": "message",
            "value": "Hello world!"
        }

#### Create or replace document [PUT]

+ Request (application/json)
    + Body
        {
            "name": "message",
            "value": "Message to add"
        }

+ Response 200
    + Body
        {
            "result":"true"
        }

+ Response 400
    + Body
        {
            "result":"false","error":"No valid message given"
        }

+ Response 500
    + Body
        {
            "result":"false","error":"Server error message"
        }


#### Delete document [DELETE]

+ Response 200
    + Body
        {
            "result":"true"
        }

+ Response 400
    + Body
        {
            "result":"false","error":"No valid message given"
        }

+ Response 500
    + Body
        {
            "result":"false","error":"Server error message"
        }


### /api/v1/docs/{document_type}

#### Get list of documents [GET]

+ Response 200 (application/json)
    + Body
        [
            {
                "id": 1
                "name": "message 1",
                "value": "Something"
            }
            {
                "id": 2
                "name": "message 2",
                "value": "Something else"
            }
        ]

#### Add documents [POST]

If no id field is given in the body of the document, a random value will be generated for the id field.

+ Request (application/json)
    + Body
        {
            "name": "message",
            "value": "Message to add"
        }

+ Response 200
    + Body
        {
            "result":"true",
            "generated_id": "3"
        }

+ Response 400
    + Body
        {
            "result":"false","error":"No valid message given"
        }

+ Response 500
    + Body
        {
            "result":"false","error":"Server error message"
        }

