const {app} = require('./server2');

const PORT = 8000;


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
