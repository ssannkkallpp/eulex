# EULEX 2.0 - Enhanced Learning Experience

A modern, accessible web application designed to help people learn how to read by providing interactive text navigation, syllable splitting, and text-to-speech functionality.

## 🌟 Features

### Core Reading Features
- **Word-by-Word Navigation**: Navigate through text one word at a time with visual highlighting
- **Syllable Splitting**: Advanced algorithm that automatically splits words into syllables for better pronunciation
- **Text-to-Speech**: High-quality speech synthesis with adjustable speed and voice selection
- **Sentence Navigation**: Jump between sentences for better reading flow
- **Interactive Word Selection**: Click on any word to jump directly to it

### Enhanced User Experience
- **Modern UI/UX**: Clean, responsive design built with Tailwind CSS
- **Multiple Themes**: Light, dark, and sepia themes for different reading preferences
- **Accessibility**: Full keyboard navigation and screen reader support
- **Progress Tracking**: Visual progress bar and reading statistics
- **Settings Persistence**: User preferences saved locally

### Educational Content
- **Curated Stories**: Carefully selected stories at different difficulty levels
- **Difficulty Levels**: Beginner, intermediate, advanced, and poetry categories
- **Reading Time Estimates**: Help users plan their reading sessions
- **Word Count Information**: Track reading progress and complexity

### Technical Improvements
- **Modern JavaScript**: ES6+ syntax with class-based architecture
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Performance Optimized**: Smooth animations and fast text processing
- **Cross-Browser Compatible**: Works on all modern browsers

## 🚀 Getting Started

### Prerequisites
- Modern web browser with Web Speech API support
- No additional software installation required

### Installation
1. Clone or download the repository
2. Open `index.html` in your web browser
3. Start reading!

### Local Development
```bash
# Clone the repository
git clone <repository-url>
cd eulex-2.0

# Open in your preferred code editor
code .

# Serve locally (optional)
python -m http.server 8000
# or
npx serve .
```

## 📖 How to Use

### Basic Navigation
- **Spacebar** or **Right Arrow**: Move to next word
- **Left Arrow**: Move to previous word
- **Up Arrow**: Move to previous sentence
- **Down Arrow**: Move to next sentence
- **P**: Play/pause current word
- **S**: Play current sentence

### Story Selection
1. Browse available stories on the main page
2. Click on any story card to begin reading
3. Stories are organized by difficulty level
4. Each story shows word count and estimated reading time

### Reading Interface
- **Current Word Display**: Shows the highlighted word and its syllable breakdown
- **Audio Controls**: Play individual words or entire sentences
- **Navigation Panel**: Use buttons or keyboard shortcuts
- **Progress Bar**: Track your reading progress
- **Settings**: Customize voice, speed, font size, and theme

### Settings & Customization
- **Voice Selection**: Choose from available system voices
- **Reading Speed**: Adjust speech rate from 0.5x to 2.0x
- **Font Size**: Scale text from 14px to 24px
- **Theme Selection**: Light, dark, or sepia themes
- **Settings Persistence**: Your preferences are saved automatically

## 🎯 Educational Benefits

### For Beginning Readers
- **Visual Word Highlighting**: Helps focus attention on individual words
- **Syllable Breakdown**: Makes complex words easier to pronounce
- **Audio Reinforcement**: Reinforces correct pronunciation
- **Controlled Pace**: Prevents reading too quickly

### For Struggling Readers
- **Multi-Sensory Learning**: Combines visual and auditory input
- **Individual Word Focus**: Reduces cognitive load
- **Repetition Control**: Can replay words as needed
- **Progress Tracking**: Builds confidence through visible progress

### For ESL Learners
- **Pronunciation Practice**: Hear correct pronunciation of each word
- **Syllable Understanding**: Learn word structure and stress patterns
- **Sentence Context**: Understand words in context
- **Adjustable Speed**: Learn at your own pace

## 🔧 Technical Details

### Browser Compatibility
- **Chrome/Edge**: Full support with all features
- **Firefox**: Full support with all features
- **Safari**: Full support with all features
- **Mobile Browsers**: Responsive design with touch-friendly interface

### Web Speech API
The application uses the Web Speech API for text-to-speech functionality:
- **SpeechSynthesis**: For text-to-speech output
- **Voice Selection**: Access to system voices
- **Rate Control**: Adjustable speech speed
- **Event Handling**: Proper start/end/error handling

### Syllable Algorithm
The enhanced syllable splitting algorithm includes:
- **Vowel Detection**: Identifies vowels including 'y' as vowel
- **Consonant Clusters**: Handles common consonant combinations
- **Special Cases**: Accounts for digraphs and trigraphs
- **Language Rules**: Applies English syllable division rules

## 📱 Mobile Experience

### Touch-Friendly Interface
- **Large Touch Targets**: Easy-to-tap buttons and controls
- **Swipe Navigation**: Gesture support for word navigation
- **Responsive Layout**: Optimized for various screen sizes
- **Mobile-Optimized Typography**: Readable text at all sizes

### Mobile-Specific Features
- **Fullscreen Mode**: Immersive reading experience
- **Touch Feedback**: Visual feedback for interactions
- **Orientation Support**: Works in portrait and landscape
- **Offline Capability**: Works without internet connection

## 🎨 Design Philosophy

### Accessibility First
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Reader Support**: Proper ARIA labels and semantic HTML
- **High Contrast Mode**: Support for high contrast preferences
- **Reduced Motion**: Respects user motion preferences

### User-Centered Design
- **Intuitive Interface**: Easy to learn and use
- **Consistent Patterns**: Familiar interaction patterns
- **Clear Visual Hierarchy**: Important elements stand out
- **Responsive Feedback**: Immediate response to user actions

## 🔮 Future Enhancements

### Planned Features
- **User Accounts**: Save reading progress and preferences
- **Custom Content**: Upload and read your own stories
- **Reading Analytics**: Detailed progress tracking and insights
- **Social Features**: Share progress and achievements
- **Offline Mode**: Download stories for offline reading

### Technical Improvements
- **PWA Support**: Install as a native app
- **Advanced Analytics**: Reading speed and comprehension metrics
- **AI Integration**: Personalized reading recommendations
- **Multi-Language Support**: Support for additional languages

## 🤝 Contributing

We welcome contributions to improve EULEX 2.0! Here are some ways you can help:

### Content Contributions
- **Story Submissions**: Submit new stories for different reading levels
- **Translation**: Help translate the interface to other languages
- **Accessibility**: Improve accessibility features and testing

### Technical Contributions
- **Bug Reports**: Report issues and suggest improvements
- **Feature Requests**: Propose new features and enhancements
- **Code Contributions**: Submit pull requests for improvements
- **Documentation**: Help improve documentation and guides

### Getting Started with Development
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Original EULEX**: Built upon the original EULEX application
- **Web Speech API**: For text-to-speech functionality
- **Tailwind CSS**: For modern, responsive styling
- **Font Awesome**: For beautiful icons
- **Google Fonts**: For typography

## 📞 Support

If you need help or have questions about EULEX 2.0:

- **Documentation**: Check this README and inline help
- **Issues**: Report bugs or request features via GitHub issues
- **Email**: Contact the development team
- **Community**: Join our community discussions

---

**EULEX 2.0** - Making reading accessible, engaging, and effective for everyone. 