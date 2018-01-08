import React, { Fragment } from 'react';
import { Link, NavLink, Route } from 'react-router-dom';
import elasticsearch from 'elasticsearch';
import PropTypes from 'prop-types';
import Spinner from '../../components/Spinner';
import FormUpload from '../../components/FormUpload';
import handleErrors from '../../lib/handleErrors';

import './File.css';

const demoServerEndpoint = `https://${process.env.REACT_APP_DEMO_SERVER}/demo`;
const projectsApiEndpoint = `https://${
  process.env.REACT_APP_ES_PROJECTS_ENDPOINT
}`;
const projectsIndex = `${process.env.REACT_APP_STAGE}-projects`;

const getIcon = status => {
  if (status === 'parsed')
    return 'ecl-icon ecl-icon--success ecl-u-color-success';
  else if (status === 'not parsed')
    return 'ecl-icon ecl-icon--warning ecl-u-color-warning';

  return 'ecl-icon ecl-icon--error ecl-u-color-error';
};

class File extends React.Component {
  constructor() {
    super();

    this.state = {
      file: {}, // load file info and store it there
      fileLoading: false,
      link: '',
      linkLoading: false,
      relatedProjects: [],
      projectsLoading: false,
      projectsCount: 0,
    };

    this.deleteFile = this.deleteFile.bind(this);
    this.generateLink = this.generateLink.bind(this);
    this.getFileMeta = this.getFileMeta.bind(this);
    this.loadFile = this.loadFile.bind(this);
    this.loadProjects = this.loadProjects.bind(this);
    this.setProjects = this.setProjects.bind(this);
    this.setEmptyProjects = this.setEmptyProjects.bind(this);
  }

  componentDidMount() {
    this.client = elasticsearch.Client({
      host: projectsApiEndpoint,
      apiVersion: '5.5',
      log: 'warning',
    });
    this.loadFile();
    this.loadProjects();
  }

  setProjects(computedKey) {
    return () =>
      this.client.indices
        .exists({
          index: projectsIndex,
        })
        .then(
          exists =>
            exists
              ? this.client
                  .search({
                    index: projectsIndex,
                    type: 'project',
                    q: `computed_key:"${computedKey}.ndjson"`,
                  })
                  .then(data =>
                    this.setState({
                      projectsLoading: false,
                      relatedProjects: data.hits.hits,
                      projectsCount: data.hits.total,
                    })
                  )
                  .catch(error => {
                    this.setEmptyProjects();
                    throw Error(`An error occured: ${error.message}`);
                  })
              : this.setEmptyProjects()
        )
        .catch(() => {
          this.setEmptyProjects();
        });
  }

  getFileMeta(computedKey) {
    return () =>
      window
        .fetch(
          `${demoServerEndpoint}/filemeta?key=${encodeURIComponent(
            computedKey
          )}`
        )
        .then(handleErrors)
        .then(response => response.json())
        .then(data =>
          this.setState({
            fileLoading: false,
            file: data[0],
          })
        )
        .catch(error => {
          console.log(`An error occured: ${error.message}`);
        });
  }

  loadFile() {
    this.setState({
      fileLoading: true,
    });

    const { match } = this.props;
    const computedKey = decodeURIComponent(match.params.id);

    this.setState({ fileLoading: true }, this.getFileMeta(computedKey));
  }

  // Load related Projects
  loadProjects() {
    const { match } = this.props;
    const computedKey = decodeURIComponent(match.params.id);

    this.setState({ projectsLoading: true }, this.setProjects(computedKey));
  }

  setEmptyProjects() {
    this.setState({
      projectsLoading: false,
      relatedProjects: [],
      projectsCount: 0,
    });
  }

  deleteFile() {
    const { match } = this.props;
    const computedKey = decodeURIComponent(match.params.id);

    const confirmDelete = window.confirm(
      'Are you sure you want to delete this file?'
    );

    if (confirmDelete) {
      window
        .fetch(
          `${demoServerEndpoint}/delete?key=${encodeURIComponent(computedKey)}`
        )
        .then(handleErrors)
        .then(response => response.json())
        .then(() => this.props.history.push('/files'))
        .catch(error => {
          console.log(`An error happened: ${error.message}`);
        });
    }
  }

  generateLink() {
    const { match } = this.props;
    const computedKey = decodeURIComponent(match.params.id);

    this.setState(
      {
        linkLoading: true,
      },
      () =>
        window
          .fetch(
            `${demoServerEndpoint}/download?key=${encodeURIComponent(
              computedKey
            )}`
          )
          .then(handleErrors)
          .then(response => response.json())
          .then(data =>
            this.setState({
              link: data.signedUrl,
              linkLoading: false,
            })
          )
          .catch(error => {
            console.log(`An error happened: ${error.message}`);
          })
    );
  }

  render() {
    const { match } = this.props;
    const {
      file,
      fileLoading,
      link,
      linkLoading,
      relatedProjects,
      projectsLoading,
      projectsCount,
    } = this.state;

    if (fileLoading) {
      return <Spinner />;
    }

    if (!file) {
      return (
        <Fragment>
          <h1 className="ecl-heading ecl-heading--h1 ecl-u-mt-none">
            File not found
          </h1>
          <Link to="/files" className="ecl-button ecl-button--secondary">
            <span className="ecl-icon ecl-icon--left" />Go Back to My Files
          </Link>
        </Fragment>
      );
    }

    const computedKey = decodeURIComponent(match.params.id);

    return (
      <Fragment>
        <h1 className="ecl-heading ecl-heading--h1 ecl-u-mt-none">
          <span className={getIcon(file.status)} title={file.message} />
          {file.original_key}
        </h1>
        <Link to="/files" className="ecl-button ecl-button--secondary">
          <span className="ecl-icon ecl-icon--left" />Go Back to My Files
        </Link>

        <div className="ecl-row ecl-u-mv-m">
          <div className="ecl-col-md-4 ecl-u-d-flex ecl-u-justify-content-center ecl-u-align-items-baseline">
            <span className="ecl-u-fs-xxl">{projectsCount}</span>
            <span className="ecl-u-fs-l">&nbsp;projects</span>
          </div>
          <div className="ecl-col-md-4 ecl-u-d-flex ecl-u-justify-content-center ecl-u-align-items-baseline">
            <span className="ecl-u-fs-xxl">
              {Math.floor(file.content_length / 1024) || 0}
            </span>{' '}
            <span className="ecl-u-fs-l">&nbsp;kB</span>
          </div>
          <div className="ecl-col-md-4 ecl-u-d-flex ecl-u-justify-content-center ecl-u-align-items-center">
            <span className="ecl-u-fs-l" title="Last update">
              {new Date(file.last_modified).toLocaleString()}
            </span>
          </div>
        </div>

        <nav className="ecl-navigation-list-wrapper">
          <h2 className="ecl-u-sr-only">Navigation Menu</h2>
          <ul className="ecl-navigation-list ecl-navigation-list--tabs">
            <li className="ecl-navigation-list__item">
              <NavLink
                to={`${match.url}`}
                exact
                className="ecl-navigation-list__link ecl-link"
                activeClassName="ecl-navigation-list__link--active"
              >
                Actions
              </NavLink>
            </li>
            <li className="ecl-navigation-list__item">
              <NavLink
                to={`${match.url}/projects`}
                className="ecl-navigation-list__link ecl-link"
                activeClassName="ecl-navigation-list__link--active"
              >
                Projects
              </NavLink>
            </li>
          </ul>
        </nav>

        <Route
          exact
          path={`${match.url}`}
          render={() => (
            <Fragment>
              <h3 className="ecl-heading ecl-heading--h3">Download</h3>
              {link ? (
                <a className="ecl-button ecl-button--secondary" href={link}>
                  <span className="ecl-icon ecl-icon--download" />
                  Download
                </a>
              ) : (
                <button
                  className="ecl-button ecl-button--secondary"
                  onClick={this.generateLink}
                  disabled={linkLoading}
                >
                  {linkLoading
                    ? 'Requesting download link...'
                    : 'Get download link'}
                </button>
              )}
              <h3 className="ecl-heading ecl-heading--h3">Update</h3>
              <FormUpload computedKey={computedKey} text="Select a file" />
              <h3 className="ecl-heading ecl-heading--h3">Delete</h3>
              <button
                className="ecl-button ecl-button--secondary"
                onClick={this.deleteFile}
              >
                Delete
              </button>
            </Fragment>
          )}
        />
        <Route
          path={`${match.url}/projects`}
          render={() => (
            <Fragment>
              {' '}
              {projectsLoading && <p>Loading related projects</p>}
              <ul>
                {relatedProjects.map(project => (
                  <li key={project._source.project_id}>
                    {project._source.title}
                  </li>
                ))}
              </ul>
            </Fragment>
          )}
        />
      </Fragment>
    );
  }
}

File.propTypes = {
  match: PropTypes.object,
  history: PropTypes.object,
};

export default File;