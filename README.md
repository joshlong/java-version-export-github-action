# A GitHub Action to Export Your Maven Project's Version for Use in Subsequent Steps 

This is a fork from [joshlong/java-version-export-github-action](https://github.com/joshlong/java-version-export-github-action)
that adds some new features to the base idea of the upstream:

> I saw a great tweet from [Bruno Borges](https://twitter.com/brunoborges) about using GitHub Actions to derive
> the version of Java to be installed by analyzing the `pom.xml` of the build itself.
> It seems like a good enough idea, so I [put it into practice here](https://github.com/joshlong/java-version-export-github-action).
> Most of the magic lives [in a very tiny JavaScript file, `index.js`](https://raw.githubusercontent.com/joshlong/java-version-export-github-action/main/index.js):
> It'll analyze your Maven `pom.xml` to determine which version of Java you've configured by having Maven tell it
> the value of `maven.compiler.version`.
> The program then exports the version and the major version of Java as a step output _and_ an environment variable
> that you could use in later steps.
> 
> I really should make this work for Gradle... (Pull requests welcome!) 

# Usage

This is a basic example of how to use this action in your workflow:

```yaml
      - uses: BetonQuest/java-version-export-github-action@main
        id: jve
```

or if you have the java version in another property like the release property:

```yaml
      - uses: BetonQuest/java-version-export-github-action@main
        id: jve
        with:
          maven-expression: 'maven.compiler.release'
```

or if you want to use a different Maven command, like `./mvnw`, or `mvnd` or the daemon in the wrapper:

```yaml
      - uses: BetonQuest/java-version-export-github-action@main
        id: jve
        with:
        maven-command: './mvnw'
        # Or for maven daemon with the --raw-streams option to work properly:
        # maven-command: './mvnw --raw-streams'
```

Then you can use the exported environment variable:

```yaml
      - uses: actions/setup-java@v4
        with:
          java-version: ${{ env.JAVA_MAJOR_VERSION }}
```

or reference the step's output values, like this:

```yaml
      - uses: actions/setup-java@v4
        with:
          java-version: ${{ steps.jve.outputs.java_major_version }}
```

Now GitHub Actions will download whatever version of Java you've specified in your Maven `pom.xml`. 
