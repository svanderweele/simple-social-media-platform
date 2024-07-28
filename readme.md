# Couch Heroes

Welcome to Couch Heroes! A friend management system.

## Features

- User registration and authentication
- Friend Managemnet
- Realtime Notifications

## Technologies Used

- Node.js
- Express.js
- Postgres
- Socket.io
- React.js + Next


The API is designed around a multiservice approach in order to decouple logic. Realtime communications are done via Socket.io.

## Getting Started

To get started with Couch Heroes, follow these steps:

1. Clone the repository: `git clone https://github.com/svanderweele/simple-social-media-platform.git`

2. Run the included scripts to create and run the necessary docker containers for the application.

```shell
chmod +xw ./run-project.sh
chmod +xw ./run-be.sh
chmod +xw ./run-fe.sh


./run-project.sh
```


## License

Couch Heroes is licensed under the [MIT License](LICENSE).
