
// Conversation is an array of subconversations. Participant should progress through the subconversations synchronously
// Subconversation is an array of message objects.

export let convo1 = [
    {
        relativeStartTime: 2 * 1 * 1000, // start 2 min after previous subConversation
        primaryOpeningMessage: 'Are you working on a word search?',
        closingMessage: {
            content: 'ok cool!',
            delay: 2000 // wait for 2 seconds before responding, so it's not instantly replying
        }
    },

    {
        relativeStartTime: 3 * 60 * 1000, // start 3 min after previous subConversation
        primaryOpeningMessage: `Hello!`,
        secondaryOpeningMessage: {
            content: 'how old are you?',
            delay: 15 * 1000 // fire 15 seconds after primary opening message
        },
        closingMessage: {
            content: 'Thanks!',
            delay: 2000
        }
    },

    {
        relativeStartTime: 4 * 60 * 1000, // start 4 min after previous subConversation
        primaryOpeningMessage: 'What month were you born in?',
        closingMessage: {
            content: 'Okay!',
            delay: 2000
        }
    },
    {
        relativeStartTime: 3 * 60 * 1000, // start 3 min after previous subConversation
        primaryOpeningMessage: 'Another question for you:',
        secondaryOpeningMessage: {
            content: 'What is your major>',
            delay: 15 * 1000 // fire 15 seconds after primary opening message
        },
        closingMessage: {
            content: 'Great, that sounds cool!',
            delay: 2000
        }
    },
];

export let convo2 = [
    {
        relativeStartTime: 2 * 60 * 1000, // start 2 min after previous subConversation
        primaryOpeningMessage: 'Are you working on a word search?',
        closingMessage: {
            content: 'ok cool!',
            delay: 2000
        }
    },
    {
        relativeStartTime: 3 * 60 * 1000, // start 3 min after previous subConversation
        primaryOpeningMessage: `Hello! How old are you?`,
        closingMessage: {
            content: 'Thanks!',
            delay: 2000
        }
    },
    {
        relativeStartTime: 4 * 60 * 1000, // start 4 min after previous subConversation
        primaryOpeningMessage: 'What month were you born in?',
        closingMessage: {
            content: 'Okay!',
            delay: 2000
        }
    },
    {
        relativeStartTime: 3 * 60 * 1000, // start 3 min after previous subConversation
        primaryOpeningMessage: 'Another question for you, what is your major?',
        closingMessage: {
            content: 'Great, that sounds cool!',
            delay: 2000
        }
    },
];