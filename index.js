var https = require("https");

exports.handler = (event, context, callback) => {    
    try {
        if (event.session.new) {
        console.log("NEW SESSION");
    }
    
        switch (event.request.type) {
            case "LaunchRequest":
                console.log("LAUNCH REQUEST");
                context.succeed(
                    generateResponse(
                        {}, buildSpeechletResponse("Welcome to an Pickup Lines", true)
                    )
                )
                break;
            case "IntentRequest":
                console.log("INTENT REQUEST");
                switch(event.request.intent.name) {
                  case "GetPickupLine":
                    var options = {
                      hostname: 'pebble-pickup.herokuapp.com',
                      path: '/tweets/random',
                      method: 'GET'
                    };

                    var req = https.request(options, (res) => {
                        res.on('data', (d) => {
                            var body = JSON.parse(d);
                            var tweet = body.tweet;
                            context.succeed(
                                generateResponse(
                                    {}, buildSpeechletResponse(tweet, true)
                                )
                            )
                        });
                    });
                    req.end();
                    break;
                  default:
                    throw "Invalid intent"
                }
                break;
            case "SessionEndedRequest":
                console.log("SESSION ENDED REQUEST");
                break;
            default:
                context.fail("INVALID REQUEST TYPE:" + event.request.type);
        }
    } catch (error) {
        context.fail("Exception: " + error);
    }
};

buildSpeechletResponse = (outputText, shouldEndSession) => {
    return {
        outputSpeech: {
            type: "PlainText",
            text: outputText
        },
        shouldEndSession: shouldEndSession
    }
}

generateResponse = (sessionAttributes, speechletResponse) => {
    return {
        version: "1.0",
        sessionAttributes: sessionAttributes,
        response: speechletResponse
    }
}