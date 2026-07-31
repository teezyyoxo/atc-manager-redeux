import { Component } from 'preact';
import WorkspaceShell from '../../components/WorkspaceShell/WorkspaceShell';
import { getBuildInfo, getChangelog } from '../../lib/build-info';
import './WhatsNew.css';

class WhatsNew extends Component {
  render() {
    const build = getBuildInfo();
    const releases = getChangelog();

    return (
      <WorkspaceShell
        className="whats-new-page"
        kicker="Release history"
        title="What’s new"
        description={`The complete ATC Manager changelog. You’re running ${build.label}.`}
      >
        <div className="changelog-list">
          {releases.map((release, releaseIndex) => (
            <article
              className={`changelog-release ${
                releaseIndex === 0 ? 'is-latest' : ''
              }`}
              key={release.version}
            >
              <header>
                <div>
                  <span>{releaseIndex === 0 ? 'Latest release' : 'Release'}</span>
                  <h2>{release.version}</h2>
                </div>
                {release.date ? <time>{release.date}</time> : null}
              </header>
              <div className="changelog-sections">
                {release.sections.map(section => (
                  <section key={section.title}>
                    <h3>{section.title}</h3>
                    <ul>
                      {section.items.map((item, index) => (
                        <li key={`${section.title}-${index}`}>{item}</li>
                      ))}
                    </ul>
                  </section>
                ))}
              </div>
            </article>
          ))}
        </div>
      </WorkspaceShell>
    );
  }
}

export default WhatsNew;
