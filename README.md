# Precise MD Clipper

A chrome extension to precisely get data from webpages. created with the intent to use with [Obsidian.md](https://obsidian.md/) properties.

## Installation

1. Download the zip file from releases
2. Unzip the extension
3. Open the Chrome Extension page and enable developer mode
4. Choose load unpacked and select the unzipped folder that contains the manifest file

## Usage

1. Open the webpage you'd like to clip
2. Click on the extension button
3. Select Add Form
4. Provide form name and download directory (it'll be relative to the 'downloads' directory)
5. Add properties and select page elements that you would like to save
6. Save the form
7. Download the MD file
8. Open up a different page with equal page structure and open the previously saved form
9. The properties will be automatically filled with the equivalent element's values

## Example

This is an example of a form I made for youtube videos:
![Youtube Page](./public/example/Youtube%20Page.png)

it resulted in this md file:
![Youtube Result](./public/example/Youtube%20Result.png)

## Roadmap

- add every obsidian property type (number, tags, checkbox, and tags)
- better date selection experience
- Integrate with Obsidian using Obsidian local rest api extension
- lots more options for the properties, such as default regex, inline option, etc
- better detailed selection experience
- header data selection system
