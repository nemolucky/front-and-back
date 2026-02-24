/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - category
 *         - price
 *         - leftInStock
 *       properties:
 *         id:
 *           type: string
 *           readOnly: true
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         category:
 *           type: string
 *           enum:
 *             - ELECTRONICS
 *             - FOOD
 *             - CLOTHING
 *             - OTHER
 *         price:
 *           type: number
 *         leftInStock:
 *           type: number
 *
 *     UpdateProduct:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         category:
 *           type: string
 *           enum:
 *             - ELECTRONICS
 *             - FOOD
 *             - CLOTHING
 *             - OTHER
 *         price:
 *           type: number
 *         leftInStock:
 *           type: number
 */
