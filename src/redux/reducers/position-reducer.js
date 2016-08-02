import _ from 'lodash'

import {
  FETCH_POSITIONS_REQUEST,
  FETCH_POSITIONS_SUCCESS,
  FETCH_POSITIONS_FAILURE,
  SHOW_NEW_POSITION_MODAL,
  HIDE_NEW_POSITION_MODAL,
  SET_NEW_POSITION_TITLE,
  SET_NEW_POSITION_DESCRIPTION,
  SET_NEW_POSITION_TITLE_VALIDATION_ERROR,
  SUBMIT_NEW_POSITION_SUCCESS,
  SUBMIT_NEW_POSITION_FAILURE,
  SET_POSITION_ORDER_BY,
  SET_POSITION_MINIMUM_VALUE_FILTER,
  SET_POSITION_MINIMUM_VALUE_DENOMINATION,
  SET_POSITION_PAGINATION_ITEMS_TO_DISPLAY,
  SET_POSITION_PAGINATION_CURRENT_PAGE,
  SET_POSITION_PAGINATION_NUMBER_OF_PAGES
} from './../actions/position-actions'

const initialState = {
  showModal: false,
  fetching: false,
  error: '',
  items: [],
  sort: {
    orderBy: 'absoluteSignal',
    direction: 'desc'
  },
  filter: {
    minimumValue: '',
    denomination: 'Ether'
  },
  pagination: {
    itemsToDisplay: 5,
    currentPage: 1
  },
  newPosition: {
    title: '',
    description: '',
    titleValidationError: ''
  }
}

export default function positionReducer(state = initialState, action) {

  switch (action.type) {

  case FETCH_POSITIONS_REQUEST:
    return Object.assign({}, state, {
      fetching: true,
      error: ''
    })

  case FETCH_POSITIONS_SUCCESS:
    return Object.assign({}, state, {
      fetching: false,
      error: '',
      items: [
        ...action.response
      ]
    })

  case FETCH_POSITIONS_FAILURE:
    return Object.assign({}, state, {
      fetching: false,
      error: ''
    })

  case SHOW_NEW_POSITION_MODAL:
    return Object.assign({}, state, {
      showModal: true
    })

  case SET_NEW_POSITION_TITLE:
    return Object.assign({}, state, {
      newPosition: Object.assign({}, state.newPosition, {
        title: action.title,
        titleValidationError: ''
      })
    })

  case SET_NEW_POSITION_DESCRIPTION:
    return Object.assign({}, state, {
      newPosition: Object.assign({}, state.newPosition, {
        description: action.description
      })
    })

  case HIDE_NEW_POSITION_MODAL:
  case SUBMIT_NEW_POSITION_FAILURE:
  case SUBMIT_NEW_POSITION_SUCCESS:
    return Object.assign({}, state, {
      showModal: false,
      newPosition: Object.assign({}, initialState.newPosition)
    })

  case SET_NEW_POSITION_TITLE_VALIDATION_ERROR:
    return Object.assign({}, state, {
      newPosition: Object.assign({}, state.newPosition, {
        titleValidationError: action.error
      })
    })

  case SET_POSITION_ORDER_BY:
    return Object.assign({}, state, {
      sort: Object.assign({}, state.sort, {
        orderBy: action.orderBy,
        direction: action.direction
      })
    })

  case SET_POSITION_MINIMUM_VALUE_FILTER:
    return Object.assign({}, state, {
      filter: Object.assign({}, state.filter, {
        minimumValue: action.minimumValue
      })
    })

  case SET_POSITION_MINIMUM_VALUE_DENOMINATION:
    return Object.assign({}, state, {
      filter: Object.assign({}, state.filter, {
        denomination: action.denomination
      })
    })

  case SET_POSITION_PAGINATION_ITEMS_TO_DISPLAY:
    return Object.assign({}, state, {
      pagination: Object.assign({}, state.pagination, {
        itemsToDisplay: _.toNumber(action.itemsToDisplay)
      })
    })

  case SET_POSITION_PAGINATION_CURRENT_PAGE:
    return Object.assign({}, state, {
      pagination: Object.assign({}, state.pagination, {
        currentPage: action.currentPage
      })
    })

  case SET_POSITION_PAGINATION_NUMBER_OF_PAGES:
    return Object.assign({}, state, {
      pagination: Object.assign({}, state.pagination, {
        numberOfPages: action.numberOfPages
      })
    })

  default:
    return state

  }

}
