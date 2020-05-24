import React, { Component } from "react";
import TutorialDataService from "../services/tutorial.service";

export class Tutorial extends Component {
  constructor(props) {
    super(props);

    this.onChangeTitle = this.onChangeTitle.bind(this);
    this.onChnageDescription = this.onChnageDescription.bind(this);
    this.getTutorial = this.getTutorial.bind(this);
    this.updatePublished = this.updatePublished.bind(this);
    this.updateTutorial = this.updateTutorial.bind(this);
    this.deleteTutorial = this.deleteTutorial.bind(this);

    this.state = {
      currentTutorial: {
        id: null,
        title: "",
        description: "",
        published: false,
      },
      message: "",
    };
  }

  componentDidMount() {
    this.getTutorial(this.props.match.params.id);
  }

  onChangeTitle(e) {
    const title = e.target.value;

    this.setState((prevState) => {
      return {
        currentTutorial: {
          ...prevState.currentTutorial,
          title: title,
        },
      };
    });
  }

  onChnageDescription(e) {
    const description = e.target.value;

    this.setState((prevState) => {
      return {
        currentTutorial: {
          ...prevState.currentTutorial,
          description: description,
        },
      };
    });
  }

  getTutorial(id) {
    TutorialDataService.get(id)
      .then((response) => {
        this.setState({
          currentTutorial: response.data,
        });
      })
      .catch((e) => {
        console.log("error while reteriving tutorila:", e);
      });
  }

  updatePublished(status) {
    const data = {
      id: this.state.currentTutorial.id,
      title: this.state.currentTutorial.title,
      description: this.state.currentTutorial.description,
      published: status,
    };

    TutorialDataService.update(this.state.currentTutorial.id, data)
      .then((response) => {
        this.setState((prevState) => {
          return {
            ...prevState.currentTutorial,
            published: status,
          };
        });
        console.log("updated: ", response.data);
      })
      .catch((e) => {
        console.log("error in updating:", e);
      });
  }

  updateTutorial() {
    TutorialDataService.update(
      this.state.currentTutorial.id,
      this.state.currentTutorial
    )
      .then((response) => {
        this.setState({
          message: "The tutorial was updated successfully!",
        });
        console.log("updated: ", response.data);
      })
      .catch((e) => {
        console.log("error in updating:", e);
      });
  }

  deleteTutorial() {
    TutorialDataService.delete(this.state.currentTutorial.id)
      .then((response) => {
        console.log("deleted:", response.data);
        this.props.history.push("/tutorials");
      })
      .catch((e) => {
        console.log("error in deleting tutorial: ", e);
      });
  }

  render() {
    const { currentTutorial } = this.state;
    return (
      <div>
        {currentTutorial ? (
          <div className="edit-form">
            <h4>Tutorial</h4>
            <form>
              <div className="form-group">
                <label htmlFor="title">Title</label>
                <input
                  type="text"
                  className="form-control"
                  id="title"
                  value={currentTutorial.title}
                  onChange={this.onChangeTitle}
                />
              </div>
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <input
                  type="text"
                  className="form-control"
                  id="description"
                  value={currentTutorial.description}
                  onChange={this.onChangeDescription}
                />
              </div>

              <div className="form-group">
                <label>
                  <strong>Status:</strong>
                </label>
                {currentTutorial.published ? "Published" : "Pending"}
              </div>
            </form>

            {currentTutorial.published ? (
              <button
                className="badge badge-primary mr-2"
                onClick={() => this.updatePublished(false)}
              >
                UnPublish
              </button>
            ) : (
              <button
                className="badge badge-primary mr-2"
                onClick={() => this.updatePublished(true)}
              >
                Publish
              </button>
            )}

            <button
              className="badge badge-danger mr-2"
              onClick={this.deleteTutorial}
            >
              Delete
            </button>

            <button
              type="submit"
              className="badge badge-success"
              onClick={this.updateTutorial}
            >
              Update
            </button>
            <p>{this.state.message}</p>
          </div>
        ) : (
          <div>
            <br />
            <p>Please click on a Tutorial...</p>
          </div>
        )}
      </div>
    );
  }
}
