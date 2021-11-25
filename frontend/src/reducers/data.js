const initialState = {
  start: null,
  end: null,
  data: [],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'hourly-data':
      return {
        ...state,
        start: action.data.start,
        end: action.data.end,
        data: action.data.data,
      };
    default:
      return state;
  }
};

export default reducer;
