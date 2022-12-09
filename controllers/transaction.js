const Transaction = require("../models/Transaction");
const { DateTime } = require("luxon");

// @desc    Create transaction
// @route   POST /api/transaction
// @access  Public
const createTransaction = async (req, res, next) => {
  const newTransaction = new Transaction(req.body);
  try {
    const saveTransaction = await newTransaction.save();
    res.status(200).json(saveTransaction);
  } catch (error) {
    next(error);
  }
};
// @desc    Get Latest five transactiona
// @route   GET /api/transaction
// @access  Public
const getLatestTransactions = async(req, res, next) => {
  try {
    const latestTrans = await Transaction.find().limit(5).populate({ path: "categories", model: "Category", select: "slug" });
    res.status(200).json(latestTrans)
  } catch (error) {
    next(error);
  }
}

// @desc    Get transaction
// @route   GET /api/transaction
// @query   Array category, Date firstDate, Date endDate
// @access  Public
const getQueryTransaction = async (req, res, next) => {
  const count = await Transaction.count();
  const { firstDate, lastDate, search } = req.query;
  const perPage = parseInt(req.query.perPage) || 10;
  const page = parseInt(req.query.page) || 1;
  const totalPage = Math.ceil(count / perPage);
  let fromPage;
  let untilPage;
  fromPage = page === 1 ? 1 : page - 1;
  untilPage = fromPage + 5;

  let queryObj = {};

  if (req.query.category) {
    queryObj.categories = req.query.category.split(",");
  }

  if (search) {
    queryObj.title = { $regex: search, $options: "$i" };
    /*  { categories: { $regex: search, $options: "$i" }} */
  }

  try {
    const transaction = await Transaction.find({
      date: {
        $gte: firstDate ? DateTime.fromISO(firstDate).toISO() : DateTime.now().minus({ days: 30 }).toISO(),
        $lt: lastDate ? DateTime.fromISO(lastDate).toISO() : DateTime.now().toISO(),
      },
      ...queryObj,
    })
      .sort({ date: -1 })
      .skip(perPage * (page - 1))
      .limit(perPage)
      .populate({ path: "categories", model: "Category", select: "slug" });

    res.status(200).json({
      currentDataLength: transaction.length,
      count: count,
      data: transaction,
      paginationData: {
        totalPages: totalPage,
        fromPage: fromPage,
        untilPage: untilPage,
        currentPage: page,
        totalResult: count,
        showFrom: perPage * (page - 1) + 1,
        showUntil: perPage * page > count ? count : perPage * page,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get single transaction
// @route GET /api/transaction/all
// @access Public
const getAllTransaction = async (req, res, next) => {
  const { firstDate, lastDate } = req.query;
  try {
    const transaction = await Transaction.find({
      date: {
        $gte: firstDate ? DateTime.fromISO(firstDate).toISO() : DateTime.now().minus({ days: 30 }).toISO(),
        $lt: lastDate ? DateTime.fromISO(lastDate).toISO() : DateTime.now().toISO(),
      },
    }).populate({ path: "categories", model: "Category", select: "slug" });
    res.status(200).json(transaction);
  } catch (error) {
    next(error);
  }
};

// @desc Get single transaction
// @route GET /api/transaction/:id
// @access Public
const getSingleTransaction = async (req, res, next) => {
  const { id } = req.params;
  try {
    const singleTrans = await Transaction.findById(id).populate({ path: "categories", model: "Category", select: "slug" });

    if (!singleTrans) {
      res.status(400);
      throw new Error("Single transaction not found");
    }

    res.status(200).json({ data: singleTrans, message: `Successfully get transaction by ${id}.` });
  } catch (error) {
    next(error);
  }
};

// @desc    Update transaction
// @route   PATCH /api/transaction/:id
// @access  Public

const updateTransaction = async (req, res, next) => {
  const { id } = req.params;

  try {
    const transId = await Transaction.findById(id);

    if (!transId) {
      res.status(400);
      throw new Error("Transaction id not found");
    }

    const transUpdate = await Transaction.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json({ data: transUpdate, message: `Transaction by ${id} successfully updated.` });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete transaction
// @route   DELETE /api/transaction/:id
// @access  Public
const deleteTransaction = async (req, res, next) => {
  const { id } = req.params;
  try {
    const transId = await Transaction.findById(id);
    if (!transId) {
      res.status(400);
      throw new Error("Transaction not found");
    }

    const transDelete = await transId.remove();
    res.status(200).json({ transDelete, message: `Transation by ${id} successfully deleted.` });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTransaction,
  getQueryTransaction,
  getLatestTransactions,
  getSingleTransaction,
  updateTransaction,
  deleteTransaction,
  getAllTransaction
};
