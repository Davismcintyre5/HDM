const ok = (res, data, message = 'OK') =>
  res.status(200).json({ success: true, message, data });

const created = (res, data, message = 'Created') =>
  res.status(201).json({ success: true, message, data });

const noContent = (res) => res.status(204).send();

const paginated = (res, items, { page = 1, limit = 20, total = 0 } = {}) =>
  res.status(200).json({
    success: true,
    data: items,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });

module.exports = { ok, created, noContent, paginated };