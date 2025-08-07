module.exports = {
  ci: {
    collect: {
      staticDistDir: "./build",
      numberOfRuns: 5,
      url: [
        "http://student.localhost:3001", // student
        "http://admin.localhost:3002", // admin
      ],
    },
    assert: {
      assertions: {
        "categories:performance": [
          "warn",
          {
            minScore: 0.8,
          },
        ],
        "categories:accessibility": [
          "error",
          {
            minScore: 0.9,
          },
        ],
      },
    },
    upload: {
      target: "temporary-public-storage",
    },
  },
};
