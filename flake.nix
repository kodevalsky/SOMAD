{
  description = "A flake for Django (uv) and React development";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-unstable";
  };

  outputs = { self, nixpkgs }:
    let
      system = "x86_64-linux";
      pkgs = nixpkgs.legacyPackages.${system};
    in
    {
      devShells.${system}.default = pkgs.mkShell {
        buildInputs = with pkgs; [
          python3
          uv
          nodejs
          yarn
        ];

        shellHook = ''
          echo "Environment ready for Django (uv) and React development!"
          echo "Python: $(python3 --version)"
          echo "uv: $(uv --version)"
          echo "Node: $(node --version)"
          echo "Yarn: $(yarn --version)"
        '';
      };
    };
}
