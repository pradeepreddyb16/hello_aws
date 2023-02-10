fib_terms = [0, 1]  # first two fibonacci terms

user_input= int(input('Enter the number you want to check\n'))

# Add new fibonacci terms until the user_input is reached
while fib_terms[-1] <= user_input:
    fib_terms.append(fib_terms[-1] + fib_terms[-2])

if user_input in fib_terms:
    print(f'Yes. {user_input} is a fibonacci number.')
else:
    print(f'No. {user_input} is NOT a fibonacci number.')

# index = index({user_input})
# print(index)
data_types = [0,1,1,2,3,5,8,13,21,34]
print(data_types.index(34))
