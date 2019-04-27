import React from 'react'
import { Action, State, withStateMachine } from 'react-automata'

const statechart = {
  initial: 'Fetching',
  states: {
    Fetching: {
      onEntry: 'startFetch',
      on: {
        FETCHED_WITH_RESULTS: 'Results',
        FETCHED_NO_RESULTS_YET: 'NoRegistersCreatedYet',
        FETCHED_NO_RESULTS_FOR_FILTER: 'NoResultsForFilter',
        FETCH_ERROR: 'Error',
      },
    },
    Results: {
      on: {
        REFETCH: 'Fetching',
        FETCH_NEXT_PAGE: 'Fetching',
        SET_FILTER: 'Fetching',
      },
    },
    NoResultsForFilter: {
      on: {
        CLEAR_FILTER_RETRY: 'Fetching',
      },
    },
    NoRegistersCreatedYet: {},
    Error: {
      on: {
        TRY_AGAIN: 'Fetching',
      },
    },
  },
}

class App extends React.Component {
  state = {
    showFilter: false,
    results: [],
    fetchError: false,
    fetchParams: {
      currentPage: 0,
      filter: '',
    },
  }

  transition = (NEXT_STATE, data) => {
    this.setState({ ...data }, () => {
      this.props.transition(NEXT_STATE)
    })
  }

  startFetch = () => {
    const delay = 2000
    const { fetchParams } = this.state
    if (fetchParams.currentPage) {
      setTimeout(() => {
        this.transition('FETCHED_WITH_RESULTS', {
          results: [
            ...this.state.results,
            fetchParams.currentPage * 4 + 1,
            fetchParams.currentPage * 4 + 2,
            fetchParams.currentPage * 4 + 3,
            fetchParams.currentPage * 4 + 4,
          ],
        })
      }, delay)
    } else if (fetchParams.filter) {
      setTimeout(() => {
        this.transition('FETCHED_NO_RESULTS_FOR_FILTER', { results: [] })
      }, delay)
    } else {
      setTimeout(() => {
        this.transition('FETCHED_WITH_RESULTS', { results: [1, 2, 3, 4] })
      }, delay)
    }
  }

  retry = () => {
    this.transition('TRY_AGAIN')
  }

  refetch = () => {
    this.transition('REFETCH', { fetchParams: { currentPage: 0, filter: '' } })
  }

  fetchNextPage = () => {
    this.transition('FETCH_NEXT_PAGE', { fetchParams: { currentPage: this.state.fetchParams.currentPage + 1 } })
  }

  setFilter = () => {
    this.transition('SET_FILTER', { fetchParams: { currentPage: 0, filter: 'SomeFilter' } })
  }

  clearFilterRetry = () => {
    this.transition('CLEAR_FILTER_RETRY', { fetchParams: { currentPage: 0, filter: '' } })
  }

  simulateNoResults = () => {
    this.transition('FETCHED_NO_RESULTS_YET', { results: [] })
  }

  simulateError = () => {
    this.transition('FETCH_ERROR', { fetchError: '500: Some descriptive error message', results: [] })
  }

  render() {
    const { results, fetchError, fetchParams } = this.state
    const hasResults = results.length > 0
    return (
      <div>
        <State is="Fetching">
          {!hasResults && (
            <div>
              <h1>LOADING</h1>
              <div className="panel">
                <button onClick={this.simulateNoResults}>Simulate no results yet</button>
                <button onClick={this.simulateError}>Simulate error</button>
              </div>
            </div>
          )}
        </State>
        <State is={['Results', 'Fetching']}>
          {hasResults && (
            <div>
              <State is="Fetching">{<div>...loading...</div>}</State>
              <div className="panel">Results {results.join(',')}</div>
              <div className="panel">
                <button onClick={this.refetch}>Reload data</button>
                <button onClick={this.setFilter}>Set Filter</button>
                <button onClick={this.fetchNextPage}>Get next page</button>
              </div>
            </div>
          )}
        </State>
        <State is="NoResultsForFilter">
          <h2>Ops, there are no results for this filter "{fetchParams.filter}"</h2>
          <button onClick={this.clearFilterRetry}>Clear filter</button>
        </State>
        <State is="NoRegistersCreatedYet">Sorry, you didn't created any registers yet...</State>
        <State is="Error">
          <h2>Error: {fetchError}</h2>
          <button onClick={this.retry}>Try again</button>
        </State>
        <pre>Current state: {this.props.machineState.value}</pre>
      </div>
    )
  }
}

export default withStateMachine(statechart)(App)
