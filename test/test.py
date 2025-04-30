# # # import json
# import numpy as np 

# arr = [
#     [
#         [ 1,2,3],
#         [4,5,6]
#     ],
#     [
#         [ 1,2,1000],
#         [4,5,6]
#     ],
#     # [
#     #     [ 1,2,9],
#     #     [4,5,6]
#     # ]
#     ]





# np_array = np.array(arr)

# print(np_array.mean())
# print(np_array.std())



# append_array =  [[
#         [ 1,7,-99999],
#         [4,5,6]
#     ]]
# check_np_arr = np.array(append_array)

# np_array = np.append(np_array,     
#     append_array, 
#     axis=0
# )
# print(np_array.mean())
# print(np_array.std())
# print(np_array.argmax())
# print(np_array.max())



# # new_np_array = np.expand_dims(np_array, axis=0)

# # # list_array = list(np_array)
# # print(check_np_arr.shape)
# # print(np_array.shape)
# # print(new_np_array.shape)





# # # arr2d = np.array([[1,2], [3,4]])

# # # new_arr2d = np.append(arr2d, [[5,6]], axis=0)

# # # print(new_arr2d)

# import json

# # data = [
# #     {
# #         "name": "Alice", 
# #         "age": 30
# #     },
# #     {
# #         "name": "Ender",
# #         "age": 17
# #     }
# # ]


# # with open("./output.json", 'w', encoding="utf-8") as f:
# #     json.dump(data, f, indent=4)

# # print('success')

# print('-----\n'*5)
# with open('./output.json', 'r', encoding='utf-8') as f:
#     data = json.load(f)
#     print(data)
#     print(type(data))


import sys
argv = sys.argv

print(argv)
print(type(argv))