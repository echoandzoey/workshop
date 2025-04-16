# Financial Aid Workshop Interactive Tool

This interactive web application lets participants act as officers reviewing financial aid applications. The workshop helps explore themes of poverty, financial stability, and the role of personal perspective and systemic bias in decision-making.

## Features

- Introduction explaining the workshop purpose
- Review of 5 applicant profiles with real-life inspired scenarios
- Decision-making for each applicant from 3 options
- Reflection recording for each decision
- Display of actual outcomes and comparison with participant decisions
- Storage of participant reflections

## Setup Instructions

### Basic Setup (Client-only)

1. Clone this repository to your local machine
2. Open `index.html` in a web browser to start the workshop

With this method, participant reflections will be stored in the browser's localStorage.

### Full Setup (with Server)

If you want to save reflections to files on a server:

1. Make sure you have Node.js installed
2. Run `npm install express body-parser` to install dependencies
3. Start the server with `node server.js`
4. Open a web browser and navigate to `http://localhost:3000`

With this method, participant reflections will be saved to a `reflections` folder on the server.

## Workshop Flow

1. **Introduction Page**: Explains the purpose and process of the workshop
2. **Profile Pages**: Shows applicant details and asks for financial aid decision
3. **Reflection Pages**: Asks participant to reflect on their decision
4. **Outcome Pages**: Shows what the applicant actually chose and their outcome
5. **Final Page**: Thanks the participant for participating

## Customization

To modify the workshop content:

- Edit `intro.json` to change the introduction text
- Edit `profiles.json` to modify the applicant profiles and outcomes

## Technologies Used

- HTML, CSS, JavaScript (frontend)
- Node.js with Express (optional backend for saving reflections)

## License

This project is open source and available for educational purposes.
