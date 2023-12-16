const z = require('zod');

const schema = z
  .object({
    title: z
      .string({
        required_error: 'Title is required',
        invalid_type_error: 'Title must be a string',
      })
      .min(1, 'Title must be at least 6 characters long'),
    competitorId1: z.string({
      required_error: 'Competitor 1 is required',
      invalid_type_error: 'Competitor 1 must be a string',
    }),
    competitorId2: z.string({
      required_error: 'Competitor 2 is required',
      invalid_type_error: 'Competitor 2 must be a string',
    }),
    startDate: z.coerce.date({
      required_error: 'Start date is required',
      invalid_type_error: 'Start date must be a date',
    }),
    endDate: z.coerce
      .date({
        invalid_type_error: 'End date must be a date',
      })
      .optional(),
    status: z
      .string({
        required_error: 'Status is required',
        invalid_type_error: 'Status must be a string',
      })
      .default('PREMATCH'),
    homeScore: z
      .number({
        required_error: 'Home score is required',
        invalid_type_error: 'Home score must be a number',
      })
      .default(0),
    awayScore: z
      .number({
        required_error: 'Away score is required',
        invalid_type_error: 'Away score must be a number',
      })
      .default(0),
  })
  .passthrough();

module.exports.validateMatch = async (match) => schema.parse(match);
