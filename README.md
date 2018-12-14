# colourClassifier
Tensor Flow Colour Classifier based on the youtube tutorial by The Coding Train

To try the classifier you need to replace apiKey: "yourkey" for your firebase apikey and set the follow rules in a real time database:

{
  "rules": {
    ".read": true,
    ".write": true,
    "colors": {
			"$entry": {
        ".write": "auth != null && !data.exists()",
        ".validate": "newData.hasChildren(['uid','r','g','b'])",
        "uid": {
          ".validate": "newData.val() === auth.uid"
        },
        "r": {
          ".validate": "newData.isNumber() && newData.val() >= 0 && newData.val() <= 255"
        },
        "g": {
          ".validate": "newData.isNumber() && newData.val() >= 0 && newData.val() <= 255"
        },
        "b": {
          ".validate": "newData.isNumber() && newData.val() >= 0 && newData.val() <= 255"
        },
        "label": {
          ".validate": "newData.isString() && newData.val().matches(/^(red|green|blue|orange|yellow|pink|purple|brown|grey)-ish$/)"
        },
        "$otherkey": {
          ".validate": "false",
        }
      }
    }
  }
}
