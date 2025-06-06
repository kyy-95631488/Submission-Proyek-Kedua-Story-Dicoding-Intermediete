export default class AboutModel {
  getProfileData() {
    return {
      name: 'Hendriansyah Rizky Setiawan',
      bio: "I'm a dedicated developer with a passion for creating intuitive and dynamic user experiences. My expertise spans across multiple domains, from crafting sleek front-end interfaces to building robust Android applications.",
      image: '/images/pribadi-kartun.png',
      skills: [
        {
          id: 'frontend',
          icon: 'fas fa-laptop-code',
          title: 'Front-End Development',
          description: 'Building responsive and interactive web interfaces with modern frameworks and CSS animations.',
        },
        {
          id: 'android',
          icon: 'fas fa-mobile-alt',
          title: 'Android Development',
          description: 'Creating high-performance mobile apps using Kotlin and Java for seamless user experiences.',
        },
        {
          id: 'java',
          icon: 'fas fa-code',
          title: 'Java & NetBeans',
          description: 'Developing robust desktop applications with Java and NetBeans for efficient solutions.',
        },
        {
          id: 'mysql',
          icon: 'fas fa-database',
          title: 'MySQL',
          description: 'Designing and managing relational databases for scalable and secure data storage.',
        },
        {
          id: 'firebase',
          icon: 'fas fa-fire',
          title: 'Firebase',
          description: 'Leveraging Firebase for real-time databases, authentication, and cloud functions.',
        },
      ],
    };
  }
}