# Club Activities Platform

A modern web application for managing and organizing club activities, designed specifically for book clubs, movie clubs, and music appreciation groups. Built with Angular 18 and Firebase.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Angular](https://img.shields.io/badge/Angular-18-red.svg)
![Firebase](https://img.shields.io/badge/Firebase-Latest-orange.svg)

## 🌟 Features

- **Multiple Club Types Support**

  - Book Clubs
  - Movie Clubs
  - Music Clubs
  - Customizable club configurations

- **Group Management**

  - Create private or public groups
  - Manage memberships
  - Unique group identifiers for private access

- **Advanced Rating System**

  - Cartesian plane rating (Interest vs. Quality)
  - Traditional numerical ratings
  - Per-track ratings for music
  - Historical tracking

- **Real-time Updates**

  - Live rating updates
  - Progress tracking
  - Activity feeds

- **Data Visualization**

  - Interactive charts
  - Detailed analytics
  - Exportable reports

- **Sharing Capabilities**
  - Deep linking
  - Rating image generation
  - Social media integration

## 📋 Prerequisites

- Node.js (v18.0.0 or higher)
- npm (v9.0.0 or higher)
- Angular CLI (v18.0.0)
- A Firebase account

## 🚀 Getting Started

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/club-activities-platform.git
   cd club-activities-platform
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure Firebase**

   - Create a new Firebase project
   - Copy your Firebase configuration
   - Create a new file `src/environments/environment.ts`:
     ```typescript
     export const environment = {
       production: false,
       firebase: {
         apiKey: "your-api-key",
         authDomain: "your-domain.firebaseapp.com",
         projectId: "your-project-id",
         storageBucket: "your-bucket.appspot.com",
         messagingSenderId: "your-sender-id",
         appId: "your-app-id",
       },
     };
     ```

4. **Start the development server**

   ```bash
   ng serve
   ```

5. **Open your browser**
   Navigate to `http://localhost:4200`

## 🏗️ Project Structure

```
src/
├── app/
│   ├── core/                 # Core features
│   ├── shared/              # Shared components
│   ├── features/            # Feature modules
│   └── data-visualization/  # Analytics
├── assets/
└── environments/
```

## 🔧 Configuration

### Firebase Setup

1. Enable Authentication with Google provider
2. Set up Firestore Database
3. Configure Storage rules
4. Set up Realtime Database
5. Deploy Firebase Functions

### Club Types

Each club type can be configured with:

- Required fields
- Rating system
- Progress tracking
- Sharing options

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Coding Standards

- Follow Angular style guide
- Write meaningful commit messages
- Include tests for new features
- Update documentation as needed

## 📜 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## 🛠️ Built With

- [Angular 18](https://angular.io/) - The web framework
- [Firebase](https://firebase.google.com/) - Backend and hosting
- [Angular Material](https://material.angular.io/) - UI components
- [NgRx](https://ngrx.io/) - State management
- [ng2-charts](https://valor-software.com/ng2-charts/) - Charts and visualizations

## ✨ Acknowledgments

- Thanks to all contributors
- Inspired by book clubs and movie discussion groups worldwide
- Special thanks to the Angular and Firebase teams

## 📞 Support

For support, please create an issue in the GitHub repository or contact the maintainers.

## 🗺️ Roadmap

- [ ] Mobile application
- [ ] API for third-party integrations
- [ ] Advanced analytics
- [ ] Multiple language support
- [ ] Offline support

## 📊 Project Status

The project is currently in active development. Check the [Projects](https://github.com/yourusername/club-activities-platform/projects) tab for current progress.
