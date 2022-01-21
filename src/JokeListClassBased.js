import React from "react";
import axios from "axios";
import JokeClassBased from "./JokeClassBased";
import "./JokeList.css";

class JokeListClassBased extends React.Component {
    constructor() {
        super();
        // this.state = { jokes: [] };
        this.state = { jokes: (JSON.parse(localStorage.getItem("jokes")) || []) }
        this.generateNewJokes = this.generateNewJokes.bind(this);
        this.getJokes = this.getJokes.bind(this);
        this.vote = this.vote.bind(this);
        this.numJokesToGet = 10;
    }

  /* get jokes if there are no jokes */
    getJokes = async function() {
        let j = [...this.state.jokes];
        let seenJokes = new Set();
        try {
        while (j.length < this.numJokesToGet) {
            let res = await axios.get("https://icanhazdadjoke.com", {
            headers: { Accept: "application/json" }
            });
            let { status, ...jokeObj } = res.data;

            if (!seenJokes.has(jokeObj.id)) {
            seenJokes.add(jokeObj.id);
            j.push({ ...jokeObj, votes: 0 });
            } else {
            console.error("duplicate found!");
            }
        }
        localStorage.setItem("jokes", JSON.stringify(j));
        this.setState({jokes: j});
        } catch (e) {
        console.log(e);
        }
    }

    componentDidMount() {
        /* empty joke list and then call getJokes */

        if (this.state.jokes.length === 0) this.getJokes(); 

    }

    componentDidUpdate() {
        /* empty joke list and then call getJokes */
        if (this.state.jokes.length === 0) this.getJokes(); 
        localStorage.setItem("jokes", JSON.stringify(this.state.jokes));   
    }

    generateNewJokes() {
        this.setState( {jokes: []});
    }

    /* change vote for this id by delta (+1 or -1) */
    vote(id, delta) {
        this.setState({ jokes: this.state.jokes.map(j => (j.id === id ? { ...j, votes: j.votes + delta } : j))});
    }

    render() {
        /* render: either loading spinner or list of sorted jokes. */
        if (this.state.jokes.length) {
            let sortedJokes = [...this.state.jokes].sort((a, b) => b.votes - a.votes);        
            return (
                <div className="JokeList">
                    <button className="JokeList-getmore" onClick={this.generateNewJokes}>
                    Get New Jokes
                    </button>
            
                    {sortedJokes.map(j => (
                    <JokeClassBased text={j.joke} key={j.id} id={j.id} votes={j.votes} vote={this.vote} />
                    ))}
                </div>
            );
        }
        // return null;  
        return  (
            <h3>Jokes are loading...</h3>
            );      
    }
}

export default JokeListClassBased;
