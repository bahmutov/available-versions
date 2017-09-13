exports['tagsByVersion supports different tags tagsByVersion 1'] = {
  "name": "tagsByVersion",
  "behavior": [
    {
      "given": {
        "latest": "2.0.0",
        "dev": "2.1.0"
      },
      "expect": {
        "2.0.0": "latest",
        "2.1.0": "dev"
      }
    },
    {
      "given": {
        "latest": "2.1.0",
        "dev": "2.1.0"
      },
      "expect": {
        "2.1.0": "latest, dev"
      }
    }
  ]
}
