import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'

export const ChiselNames = z.enum([
  "Cartographer's Chisel",
  "Maven's Chisel of Avarice",
  "Maven's Chisel of Divination",
  "Maven's Chisel of Procurement",
  "Maven's Chisel of Proliferation",
  "Maven's Chisel of Scarabs",
])

export const farmingSessionSchema = toTypedSchema(
  z
    .object({
      //session info
      sessionName: z.string().min(2).max(50),
      sessionDescription: z.string().min(2).max(250),
      sessionNotes: z.string().max(250).optional(),
      //map info
      isRandomMap: z.boolean(),
      mapName: z.string().min(2).max(50),
      isOriginator: z.boolean(),
      isSelfFarmed: z.boolean(),
      mapCost: z.number().optional(),
      numberOfMaps: z.number().min(1).max(1000),
      //chisels info
      isUsingChisels: z.boolean(),
      chiselName: ChiselNames.optional(),
      chiselPrice: z.number().optional(),
      //scarabs info
      isUsingScarabs: z.boolean(),
      scarabs: z.array(
        z.object({
          name: z.string().max(50).optional(),
          quantity: z.number().max(5).optional(),
          price: z.number().optional(),
        }),
      ),
      //map device craft info
      isUsingMapCraft: z.boolean(),
      mapCraftName: z.string().max(50).optional(),
      mapCraftPrice: z.number().optional(),
    })
    .superRefine((data, ctx) => {
      if (!data.isSelfFarmed) {
        if (data.mapCost === undefined) {
          ctx.addIssue({
            code: 'custom',
            message: 'Map cost is required',
            path: ['mapCost'],
          })
        }
      }
      if (data.isUsingChisels) {
        if (data.chiselPrice === undefined) {
          ctx.addIssue({
            code: 'custom',
            message: 'Chisel price is required',
            path: ['chiselPrice'],
          })
        }
      }
      if (data.isUsingScarabs) {
        const totalQuantity = data.scarabs.reduce((sum, s) => sum + (s.quantity ?? 0), 0)
        const lastScarabIndex = data.scarabs.length - 1
        if (totalQuantity > 5) {
          ctx.addIssue({
            code: 'custom',
            message: "You can't use more than 5 scarabs total (map device limit)",
            path: ['scarabs[' + lastScarabIndex + '].quantity'],
          })
        }
        data.scarabs.forEach((scarab, index) => {
          if (scarab.name === undefined) {
            ctx.addIssue({
              code: 'custom',
              message: 'Name is required when using scarabs',
              path: ['scarabs[' + index + '].name'],
            })
          }
          if (scarab.quantity === undefined) {
            ctx.addIssue({
              code: 'custom',
              message: 'Quantity is required when using scarabs',
              path: ['scarabs[' + index + '].quantity'],
            })
          }
          if (scarab.price === undefined) {
            ctx.addIssue({
              code: 'custom',
              message: 'Price must be greater than 0',
              path: ['scarabs[' + index + '].price'],
            })
          }
        })
      }
      if (data.isUsingMapCraft) {
        if (data.mapCraftName === undefined) {
          ctx.addIssue({
            code: 'custom',
            message: 'Map craft name is required',
            path: ['mapCraftName'],
          })
        }
        if (data.mapCraftPrice === undefined) {
          ctx.addIssue({
            code: 'custom',
            message: 'Map craft price is required',
            path: ['mapCraftPrice'],
          })
        }
      }
    }),
)

export const initialFormValues = {
  sessionName: '',
  sessionDescription: '',
  sessionNotes: '',
  mapName: '',
  isRandomMap: false,
  isOriginator: false,
  isSelfFarmed: false,
  mapCost: undefined,
  numberOfMaps: 1,
  isUsingChisels: true,
  chiselName: "Cartographer's Chisel" as const,
  chiselPrice: undefined,
  isUsingScarabs: true,
  scarabs: [] as Array<{
    name?: string
    quantity?: number
    price?: number
  }>,
  isUsingMapCraft: true,
  mapCraftName: '',
  mapCraftPrice: undefined,
}

export type FarmingSessionFormValues = typeof initialFormValues

export const completeSessionSchema = toTypedSchema(
  z.object({
    totalReturns: z
      .number({ message: 'Please input a valid number' })
      .min(0, 'Total returns must be a positive number'),
    divCost: z
      .number({ message: 'Please input a valid number' })
      .min(1, 'Divine cost must be greater than 0'),
  }),
)

export const initialCompleteSessionValues = {
  totalReturns: 0,
  divCost: 200, // Default divine cost in chaos
}

export type CompleteSessionFormValues = typeof initialCompleteSessionValues
