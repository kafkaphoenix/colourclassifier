# colourClassifier
Tensor Flow Colour Classifier based on the youtube tutorial by The Coding Train

To try the classifier you need to replace apiKey: "yourkey" for your firebase apikey and set the follow rules in a real time database:
```
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
```

collectData.html is the page which collect colour data.

dataPreview.html shows the data collected from an specific colour, all colours or submitted by an user (you need to uncomment each option). Click on a color square to see more data about it on console.

model.html constructs the model and guess an colour which you can change with the rgb sliders, moreover show the loss. Model is explained in sketch3.js.

Thanks to Daniel Shiffman for his incredible tutorial in which is based this project.
