# Bootiful Podcast Mode Configuration Action

This action prints "Hello World" or "Hello" + the name of a person to greet to the log. It follows 
[the tutorial here](https://docs.github.com/en/free-pro-team@latest/actions/creating-actions/creating-a-javascript-action)

## Inputs

### `who-to-greet`

**Required** The name of the person to greet. Default `"World"`.

## Outputs

### `time`

The time we greeted you.

## Example usage

uses: bootiful-podcast/bootiful-podcast-action@v1
with:
  who-to-greet: 'Mona the Octocat'
