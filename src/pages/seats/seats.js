const rows = [];

for(let i = 0; i < 105; i++) {
    rows.push(
        {
            id: i,
            number_of_seats: 8 + Math.floor(Math.random() * 20),
        }
    )
}

export default rows;