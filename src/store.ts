type Note = {
  id: string;
  title: string;
  completed: boolean;
};

type State = {
  notes: Array<Note>;
};

type Action =
  | {
      type: "to_feed";
      note: string;
    }
  | {
      type: "to_sleep";
      note: string;
    }
  | {
      type: "to_play";
      note: string;
    }
  | {
      type: "set_name";
      note: string;
    };

export const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case "to_feed":
      return {
        ...state,
        notes: [
          ...state.notes,
          {
            id: Math.random().toString(36).substring(7),
            title: action.note,
            completed: false,
          },
        ],
      };

    case "to_sleep":
      return {
        ...state,
        notes: [
          ...state.notes,
          {
            id: Math.random().toString(36).substring(7),
            title: action.note,
            completed: false,
          },
        ],
      };


    case "to_play":
      return {
        ...state,
        notes: [
          ...state.notes,
          {
            id: Math.random().toString(36).substring(7),
            title: action.note,
            completed: false,
          },
        ],
      };

    
    case "set_name":
      return {
        ...state,
        notes: [
          ...state.notes,
          {
            id: Math.random().toString(36).substring(7),
            title: action.note,
            completed: false,
          },
        ],
      };

    default:
      throw new Error();
  }
};
