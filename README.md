# React state machine example

Example managing a results screen likely states with a state machine: fetching, error, reload, filtering and display.

## State configuration

```
{
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
```
