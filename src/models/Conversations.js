
// Conversation is an array of subconversations. Participant should progress through the subconversations synchronously
// Subconversation is an array of message objects.

export let convo1 = [
    {
        relativeStartTime: 1000, // start 2 min after previous subConversation
        primaryOpeningMessage: 'Are you working on a word search?',
        closingMessage: {
            content: 'ok cool!',
            delay: 1000
        }
    },

    {
        relativeStartTime: 3000, // start 3 min after previous subConversation
        primaryOpeningMessage: `Hello!`,
        secondaryOpeningMessage: {
            content: 'how old are you?',
            delay: 3 * 1000 // fire 30 seconds after primary opening message
        },
        closingMessage: {
            content: 'Thanks!',
            delay: 1000
        }
    },

    {
        relativeStartTime: 3 * 1000, // start 3 min after previous subConversation
        primaryOpeningMessage: 'What month were you born in?',
        closingMessage: {
            content: 'Okay!',
            delay: 1000
        }
    },
    {
        relativeStartTime: 2 * 1000, // start 2 min after previous subConversation
        primaryOpeningMessage: 'Another question for you:',
        secondaryOpeningMessage: {
            content: 'What is your major>',
            delay: 5 * 1000 // fire 30 seconds after primary opening message
        },
        closingMessage: {
            content: 'Great, that sounds cool!',
            delay: 1000
        }
    },
];

export let convo2 = [
    {
        relativeStartTime: 2 * 60 * 1000, // start 2 min after previous subConversation
        primaryOpeningMessage: 'Are you working on a word search?',
        closingMessage: 'ok cool!'
    },
    {
        relativeStartTime: 3 * 60 * 1000, // start 3 min after previous subConversation
        primaryOpeningMessage: `Hello! How old are you?`,
        closingMessage: 'Thanks!'
    },
    {
        relativeStartTime: 3 * 60 * 1000, // start 3 min after previous subConversation
        primaryOpeningMessage: 'What month were you born in?',
        closingMessage: 'Okay!'
    },
    {
        relativeStartTime: 2 * 60 * 1000, // start 2 min after previous subConversation
        primaryOpeningMessage: 'Another question for you, what is your major?',
        closingMessage: 'Great, that sounds cool!'
    },
];