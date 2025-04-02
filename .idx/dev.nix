{ pkgs, ... }: {
  channel = "stable-24.05"; # or "unstable"
  packages = [
    pkgs.nodejs
    pkgs.mongodb
  ];
  env = {};
  idx = {
    extensions = [
      "mongodb.mongodb-vscode"
      "rangav.vscode-thunder-client"
      "streetsidesoftware.code-spell-checker"
      "streetsidesoftware.code-spell-checker-spanish"
      "usernamehw.errorlens"
      "yandeu.five-server"
    ];
    previews = {
      enable = false;
      previews = {};
    };
    workspace = {
      onCreate = {};
      onStart = {
        mongo-db = "./.mongodb/start.bash";
      };
    };
  };
}
