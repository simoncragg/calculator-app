# 1.2.0 (2024-02-25)

[Compare v1.1.0 → v1.2.0](https://github.com/simoncragg/calculator-app/compare/v1.1.0...v1.2.0)

### Bug Fixes

    * exclude inversion symbol from digit count (56a1577 (https://github.com/simoncragg/calculator-app/commit/56a15772f1813c52e03639c552d9bb418c755fca))
    * update package-lock.json with 'engines' section from package.json (27cb809 (https://github.com/simoncragg/calculator-app/commit/27cb8092fb303591fc1bc3c2587fd88264d49463))

### Features

    * add engines section to package.json (daa91db (https://github.com/simoncragg/calculator-app/commit/daa91db8fbe1ba7c885fda7350728882094f0f4f))
    * update meta description (2e4c2df (https://github.com/simoncragg/calculator-app/commit/2e4c2df9b6271b048a1005acfaac285489c6ccf1))

# 1.1.0 (2024-02-22)

[Compare v1.0.0 → v1.1.0](https://github.com/simoncragg/calculator-app/compare/v1.0.0...v1.1.0)

### Bug Fixes

    * fix defects in MDAS step evaluation display (6fd24cb (https://github.com/simoncragg/calculator-app/commit/6fd24cb539d3343a488c43dbf535c7d53ffe3049))
      1. Handle multi-digit operands.
      2. Evaluate the preceding Multiplication or Division step when the Add or Subtract operator is selected.

### Features

    * calculate percentage of the current operand in relation to the last operand (0c5b4bf (https://github.com/simoncragg/calculator-app/commit/0c5b4bff99b220133c15786d06cc4712ba3d646e))
    * equals indicator (3d5bb12 (https://github.com/simoncragg/calculator-app/commit/3d5bb125e6162f3cd7e7269a7c098cbd3b6b9027))
    * improve the presentation of the operator and equals indicators (247cfc9 (https://github.com/simoncragg/calculator-app/commit/247cfc90b60c8d964e1aa8138602871c4b65e4f5))
    * infer missing operand (285c9fe (https://github.com/simoncragg/calculator-app/commit/285c9fee867d7ed5fbc0bb25c337f79917844ceb))
    * interactive solar panel simulation (55449ef (https://github.com/simoncragg/calculator-app/commit/55449ef0922e25a5998aed1f72c43a805c68e81b))
    * operator selection indicators (7b875c8 (https://github.com/simoncragg/calculator-app/commit/7b875c8fccf98a24defe026b9b577b9b180e8de3))

# 1.0.0 (2024-02-17)

### Bug Fixes

    * handling of consecutive operator selections (bc29591 (https://github.com/simoncragg/calculator-app/commit/bc295916e116ff5df8efd34a1281765f5b9f6ae7))
    * precision for exponential number (9f11a70 (https://github.com/simoncragg/calculator-app/commit/9f11a706a19c928bc7455a8aefaf098a8a22ba66))
    * update transitive dependency to mitigate vulnerability (5aaf192 (https://github.com/simoncragg/calculator-app/commit/5aaf192a16624b341710a92b4b13eda033a2037a))

### Features

    * AC (all clear) and C (clear) (aa37086 (https://github.com/simoncragg/calculator-app/commit/aa37086b7dcf1ff15ae4b10e5717decd75f5d148)) 
    * calculate percent (20339a1 (https://github.com/simoncragg/calculator-app/commit/20339a1772112317c9957e791010c8615ce7c970))
    * calculator ui with initial state (90ac896 (https://github.com/simoncragg/calculator-app/commit/90ac8965d29e9fea14e69dd5d4abf06bd367d2d0))
    * display any MDAS simplification steps (617556c (https://github.com/simoncragg/calculator-app/commit/617556ce740fbd2ce221b76b64402b4621c91e05))
    * enter an operand (f1fa2d4 (https://github.com/simoncragg/calculator-app/commit/f1fa2d46cc5d07ff019e056a8cd695b3eeefc5f0))
    * implement code splitting for optimized dependency bundling (aab5cb5 (https://github.com/simoncragg/calculator-app/commit/aab5cb52ac35ed8af9909e51e4a28a854e723cac))
    * improve responsive vertical positioning (5f9f3db (https://github.com/simoncragg/calculator-app/commit/5f9f3db3141fdeaf501f55fee0f68bdda5d45ad4))
    * invert number (205f632 (https://github.com/simoncragg/calculator-app/commit/205f632802100a5f295d750ed49656638a4b6691))
    * reduce max digits to 9 and use exponential notation when longer (95a7cc7 (https://github.com/simoncragg/calculator-app/commit/95a7cc7b80f8bfa6032eb91489b13613fb10ca5d))
    * repeat last operation (055b65f (https://github.com/simoncragg/calculator-app/commit/055b65f5b660dce3f2b949d5d2ad30547d9390f0))        
    * solve arithmetic expressions (c59c2a7 (https://github.com/simoncragg/calculator-app/commit/c59c2a7838aceb095795bb007d656b4838f3d725)) 
    * update body background color (c0605f0 (https://github.com/simoncragg/calculator-app/commit/c0605f0c4de296fb1bdead797a77a2dc34766b52)) 
