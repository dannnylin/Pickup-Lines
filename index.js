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
                        {}, buildSpeechletResponse("Welcome to Pickup Lines, ask me for a pickup line.", false)
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
                    case "AMAZON.HelpIntent":
                    context.succeed(
                        generateResponse(
                            {}, buildSpeechletResponse("You can ask me for a pickup line that you can use the next time you are trying to get someone's phone number. Would you like a pickup line, if you do please ask me for one?", false)
                        )
                    )
                    break;
                    case "AMAZON.StopIntent" || "AMAZON.CancelIntent":
                    context.succeed(
                        generateResponse(
                            {}, buildSpeechletResponse("Goodbye.", true)
                        )
                    )
                    break;
                  default:
                    throw "Invalid intent"
                }
                break;
            case "SessionEndedRequest":
                console.log("SESSION ENDED REQUEST");
                break;
            default:
                context.fail("INVALID REQUEST TYPE: " + event.request.type);
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