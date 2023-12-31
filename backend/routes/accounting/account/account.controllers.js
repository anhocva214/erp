const prisma = require("../../../utils/prisma");
const {getPagination} = require("../../../utils/query");

const createSingleAccount = async (req, res) => {
  try {
    const createdAccount = await prisma.subAccount.create({
      data: {
        name: req.body.name,
        account: {
          connect: {
            id: Number(req.body.accountId),
          },
        },
      },
    });
    return res.status(200).json(createdAccount);
  } catch (error) {
    return res.status(400).json({message: error.message});
  }
};

const getAllAccount = async (req, res) => {
  if (req.query.query === "tb") {
    const allAccount = await prisma.account.findMany({
      orderBy: [
        {
          id: "asc",
        },
      ],
      include: {
        subAccount: {
          include: {
            debit: {
              where: {
                status: true,
              },
            },
            credit: {
              where: {
                status: true,
              },
            },
          },
        },
      },
    });
    // some up all debit and credit amount from each subAccount and add it to every subAccount object
    let tb = {};
    const accountInfo = allAccount.map((account) => {
      return account.subAccount.map((subAccount) => {
        const totalDebit = subAccount.debit.reduce((acc, debit) => {
          return acc + debit.amount;
        }, 0);
        const totalCredit = subAccount.credit.reduce((acc, credit) => {
          return acc + credit.amount;
        }, 0);
        return (tb = {
          account: account.name,
          subAccount: subAccount.name,
          totalDebit,
          totalCredit,
          balance: totalDebit - totalCredit,
        });
      });
    });
    // transform accountInfo into an single array
    const trialBalance = accountInfo.flat();
    let debits = [];
    let credits = [];
    trialBalance.forEach((item) => {
      if (item.balance > 0) {
        debits.push(item);
      }
      if (item.balance < 0) {
        credits.push(item);
      }
    });
    //some up all debit and credit balance
    const totalDebit = debits.reduce((acc, debit) => {
      return acc + debit.balance;
    }, 0);
    const totalCredit = credits.reduce((acc, credit) => {
      return acc + credit.balance;
    }, 0);

    // check if total debit is equal to total credit
    let match = true;
    if (-totalDebit === totalCredit) {
      match = true;
    } else {
      match = false;
    }
    // return res.status(200).json(allAccount);
    return res
      .status(200)
      .json({match, totalDebit, totalCredit, debits, credits});
  } else if (req.query.query === "bs") {
    const allAccount = await prisma.account.findMany({
      orderBy: [
        {
          id: "asc",
        },
      ],
      include: {
        subAccount: {
          include: {
            debit: {
              where: {
                status: true,
              },
            },
            credit: {
              where: {
                status: true,
              },
            },
          },
        },
      },
    });
    // some up all debit and credit amount from each subAccount and add it to every subAccount object
    let tb = {};
    const accountInfo = allAccount.map((account) => {
      return account.subAccount.map((subAccount) => {
        const totalDebit = subAccount.debit.reduce((acc, debit) => {
          return acc + debit.amount;
        }, 0);
        const totalCredit = subAccount.credit.reduce((acc, credit) => {
          return acc + credit.amount;
        }, 0);
        return (tb = {
          account: account.type,
          subAccount: subAccount.name,
          totalDebit,
          totalCredit,
          balance: totalDebit - totalCredit,
        });
      });
    });
    // transform accountInfo into an single array
    const balanceSheet = accountInfo.flat();
    let assets = [];
    let liabilities = [];
    let equity = [];
    balanceSheet.forEach((item) => {
      if (item.account === "Asset" && item.balance !== 0) {
        assets.push(item);
      }
      if (item.account === "Liability" && item.balance !== 0) {
        // convert negative balance to positive and vice versa
        liabilities.push({
          ...item,
          balance: -item.balance,
        });
      }
      if (item.account === "Owner's Equity" && item.balance !== 0) {
        // convert negative balance to positive and vice versa
        equity.push({
          ...item,
          balance: -item.balance,
        });
      }
    });
    //some up all asset, liability and equity balance
    const totalAsset = assets.reduce((acc, asset) => {
      return acc + asset.balance;
    }, 0);
    const totalLiability = liabilities.reduce((acc, liability) => {
      return acc + liability.balance;
    }, 0);
    const totalEquity = equity.reduce((acc, equity) => {
      return acc + equity.balance;
    }, 0);

    // check if total asset is equal to total liability and equity
    let match = true;
    if (-totalAsset === totalLiability + totalEquity) {
      match = true;
    } else {
      match = false;
    }
    return res.status(200).json({
      match,
      totalAsset,
      totalLiability,
      totalEquity,
      assets,
      liabilities,
      equity,
    });
  } else if (req.query.query === "is") {
    const allAccount = await prisma.account.findMany({
      orderBy: [
        {
          id: "asc",
        },
      ],
      include: {
        subAccount: {
          include: {
            debit: {
              where: {
                status: true,
              },
            },
            credit: {
              where: {
                status: true,
              },
            },
          },
        },
      },
    });
    // some up all debit and credit amount from each subAccount and add it to every subAccount object
    let tb = {};
    const accountInfo = allAccount.map((account) => {
      return account.subAccount.map((subAccount) => {
        const totalDebit = subAccount.debit.reduce((acc, debit) => {
          return acc + debit.amount;
        }, 0);
        const totalCredit = subAccount.credit.reduce((acc, credit) => {
          return acc + credit.amount;
        }, 0);
        return (tb = {
          id: subAccount.id,
          account: account.name,
          subAccount: subAccount.name,
          totalDebit,
          totalCredit,
          balance: totalDebit - totalCredit,
        });
      });
    });
    // transform accountInfo into an single array
    const incomeStatement = accountInfo.flat();
    let revenue = [];
    let expense = [];
    incomeStatement.forEach((item) => {
      if (item.account === "Revenue" && item.balance !== 0) {
        // convert negative balance to positive and vice versa
        revenue.push({
          ...item,
          balance: -item.balance,
        });
      }
      if (item.account === "Expense" && item.balance !== 0) {
        // convert negative balance to positive and vice versa
        expense.push({
          ...item,
          balance: -item.balance,
        });
      }
    });

    //some up all revenue and expense balance
    const totalRevenue = revenue.reduce((acc, revenue) => {
      return acc + revenue.balance;
    }, 0);
    const totalExpense = expense.reduce((acc, expense) => {
      return acc + expense.balance;
    }, 0);

    return res.status(200).json({
      totalRevenue,
      totalExpense,
      profit: totalRevenue + totalExpense,
      revenue,
      expense,
    });
  } else if (req.query.type === "sa" && req.query.query === "all") {
    // subAccount
    try {
      const allSubAccount = await prisma.subAccount.findMany({
        orderBy: [
          {
            id: "asc",
          },
        ],
        where: {
          status: true,
        },
        include: {
          account: {
            select: {
              name: true,
              type: true,
            },
          },
        },
      });
      return res.status(200).json(allSubAccount);
    } catch (error) {
      return res.status(400).json({message: error.message});
    }
  } else if (req.query.type === "sa") {
    // subAccount
    const {skip, limit} = getPagination(req.query);
    try {
      const allSubAccount = await prisma.subAccount.findMany({
        orderBy: [
          {
            id: "asc",
          },
        ],
        where: {
          status: JSON.parse(req.query.status),
        },
        skip: parseInt(skip),
        take: parseInt(limit),
        include: {
          account: {
            select: {
              name: true,
              type: true,
            },
          },
        },
      });
      const aggregations = await prisma.subAccount.aggregate({
        _count: {
          id: true,
        },
      });
      return res.status(200).json({
        getAllSubAccount: allSubAccount,
        totalSubAccount: aggregations._count.id,
      });
    } catch (error) {
      return res.status(400).json({message: error.message});
    }
  } else if (req.query.query === "ma") {
    // mainAccount
    try {
      const allSubAccount = await prisma.account.findMany({
        orderBy: [
          {
            id: "asc",
          },
        ],
      });
      return res.status(200).json(allSubAccount);
    } catch (error) {
      return res.status(400).json({message: error.message});
    }
  } else {
    try {
      const allAccount = await prisma.account.findMany({
        orderBy: [
          {
            id: "asc",
          },
        ],
        include: {
          subAccount: {
            include: {
              debit: true,
              credit: true,
            },
          },
        },
      });
      return res.status(200).json(allAccount);
    } catch (error) {
      return res.status(400).json({message: error.message});
    }
  }
};

const getSingleAccount = async (req, res) => {
  try {
    const singleAccount = await prisma.subAccount.findUnique({
      where: {
        id: Number(req.params.id),
      },
      include: {
        debit: true,
        credit: true,
      },
    });
    // calculate balance from total debit and credit
    const totalDebit = singleAccount.debit.reduce((acc, debit) => {
      return acc + debit.amount;
    }, 0);
    const totalCredit = singleAccount.credit.reduce((acc, credit) => {
      return acc + credit.amount;
    }, 0);
    const balance = totalDebit - totalCredit;
    singleAccount.balance = balance;
    return res.status(200).json(singleAccount);
  } catch (error) {
    return res.status(400).json({message: error.message});
  }
};

const updateSingleAccount = async (req, res) => {
  try {
    const updatedAccount = await prisma.subAccount.update({
      where: {
        id: Number(req.params.id),
      },
      data: {
        name: req.body.name,
        account: {
          connect: {
            id: Number(req.body.accountId),
          },
        },
      },
    });
    return res.status(200).json(updatedAccount);
  } catch (error) {
    return res.status(400).json({message: error.message});
  }
};

const deleteSingleAccount = async (req, res) => {
  try {
    const deletedSubAccount = await prisma.subAccount.update({
      where: {
        id: Number(req.params.id),
      },
      data: {
        status: req.body.status,
      },
    });
    return res.status(200).json(deletedSubAccount);
  } catch (error) {
    return res.status(400).json({message: error.message});
  }
};

module.exports = {
  createSingleAccount,
  getAllAccount,
  getSingleAccount,
  updateSingleAccount,
  deleteSingleAccount,
};
