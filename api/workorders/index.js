module.exports = async function (context, req) {
  const sample = [
    { id: "wo1", title: "PM Service – Trailer 1827", status: "scheduled" },
    { id: "wo2", title: "No-cool Call – Truck 55", status: "in_progress" }
  ];
  context.res = { status: 200, body: sample };
};
