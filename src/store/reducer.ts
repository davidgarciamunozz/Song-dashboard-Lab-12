export const reducer = (currentAction: any, currentState: any) => {
	const { action, payload } = currentAction;

	switch (action) {
        case 'GET_SONGS':
            return {
                ...currentState,
                songs: payload
            }
		default:
			return currentState;
	}
};